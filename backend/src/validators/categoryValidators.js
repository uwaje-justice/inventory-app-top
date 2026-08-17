import { body } from "express-validator";
import { idParam } from "./index.js";

export const categoryIdParamValidator = idParam("category");

export const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
];

export const updateCategoryValidator = [
  ...categoryIdParamValidator,
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
];
