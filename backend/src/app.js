import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./utils/errors.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;
