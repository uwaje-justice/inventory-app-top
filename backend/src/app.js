import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./utils/errors.js";
import passport from "./lib/passport.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
// helmet sets HTTP headers like X-Content-Type-Options, X-Frame-Options,
// Strict-Transport-Security, etc. that protect against common web vulnerabilities.
// In a portfolio project these aren't critical, but they're good practice and
// required by most production security audits.
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
// When deploying frontend and backend to separate origins (e.g. Vercel + Render),
// the browser blocks cross-origin requests unless the server explicitly allows
// them. CLIENT_URL must be set to the frontend's deployed URL.
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body parsing with size limit ─────────────────────────────────────────────
// Without a size limit, an attacker could send a multi-GB payload and exhaust
// server memory (DoS). 1mb is generous for this app's use case.
app.use(express.json({ limit: "1mb" }));

app.use(passport.initialize());

// ── Rate limiting on auth routes ─────────────────────────────────────────────
// Without rate limiting, an attacker can brute-force login credentials by
// trying thousands of passwords per second. 20 attempts per 15 minutes per IP
// is generous for legitimate users but makes credential stuffing impractical.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
