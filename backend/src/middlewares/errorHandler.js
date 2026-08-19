import { AppError } from "../utils/errors.js";

export function errorHandler(err, req, res, next) {
  if (!(err instanceof AppError)) {
    console.error(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err instanceof AppError ? err.message : "Internal Server Error",
    statusCode,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}
