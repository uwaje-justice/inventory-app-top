import { param } from "express-validator";

export const idParam = (resource) => [
  param("id").isUUID().withMessage(`Invalid ${resource} ID`),
];
