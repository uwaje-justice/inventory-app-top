import { body } from "express-validator";
import { idParam } from "./index.js";

export const categoryIdParam = idParam("category");

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
];

export const updateCategoryValidation = [
  ...categoryIdParam,
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
];
