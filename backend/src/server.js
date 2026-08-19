import "dotenv/config";
import app from "./app.js";
import db from "./lib/db.js";

// ── Env validation ───────────────────────────────────────────────────────────
// Fail fast on startup if critical env vars are missing. Without this, the
// server would start and then crash with a cryptic error on the first request.
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required but not set. Exiting.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required but not set. Exiting.");
  process.exit(1);
}

// ── Global error handlers ────────────────────────────────────────────────────
// Catch unhandled promise rejections and uncaught exceptions that escape the
// Express error-handling middleware. Without these, the process would crash
// silently in production with no logging.
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

// ── Start server ─────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

// ── Graceful shutdown ────────────────────────────────────────────────────────
// PaaS platforms (Render, Railway, Fly.io) send SIGTERM when scaling down.
// Without this handler, connections are killed abruptly and in-flight requests
// are lost. This drains connections and disconnects Prisma before exiting.
const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await db.$disconnect();
    process.exit(0);
  });
  // Force exit after 10s if graceful shutdown stalls
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
