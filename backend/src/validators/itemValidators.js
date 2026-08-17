import { body } from "express-validator";
import { idParam } from "./index.js";

export const itemIdParam = idParam("item");

export const createItemValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("quantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("categoryId")
    .notEmpty().withMessage("Category ID is required")
    .isUUID().withMessage("Invalid category ID"),
  body("supplierId")
    .optional()
    .isUUID().withMessage("Invalid supplier ID"),
];

export const updateItemValidation = [
  ...itemIdParam,
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("quantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("categoryId")
    .notEmpty().withMessage("Category ID is required")
    .isUUID().withMessage("Invalid category ID"),
  body("supplierId")
    .optional()
    .isUUID().withMessage("Invalid supplier ID"),
];
