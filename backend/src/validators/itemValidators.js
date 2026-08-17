import { body } from "express-validator";
import { idParam } from "./index.js";

export const itemIdParamValidator = idParam("item");

export const createItemValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("categoryId").notEmpty().withMessage("Category ID is required").isUUID().withMessage("Invalid category ID"),
  body("supplierId").optional().isUUID().withMessage("Invalid supplier ID"),
];

export const updateItemValidator = [
  ...itemIdParamValidator,
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().trim(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("categoryId").notEmpty().withMessage("Category ID is required").isUUID().withMessage("Invalid category ID"),
  body("supplierId").optional().isUUID().withMessage("Invalid supplier ID"),
];
