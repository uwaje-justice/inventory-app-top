import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./utils/errors.js";
import passport from "./lib/passport.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
