import { body } from "express-validator";
import { idParam } from "./index.js";

export const supplierIdParam = idParam("supplier");

export const createSupplierValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("contactName")
    .optional()
    .trim(),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Must be a valid email").bail()
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim(),
];

export const updateSupplierValidation = [
  ...supplierIdParam,
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("contactName")
    .optional()
    .trim(),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Must be a valid email").bail()
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim(),
];
