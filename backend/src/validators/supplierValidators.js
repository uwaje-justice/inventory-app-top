import { body } from "express-validator";
import { idParam } from "./index.js";

export const supplierIdParamValidator = idParam("supplier");

export const createSupplierValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("contactName").optional().trim(),
  body("email").optional().trim().isEmail().withMessage("Must be a valid email").bail().normalizeEmail(),
  body("phone").optional().trim(),
];

export const updateSupplierValidator = [
  ...supplierIdParamValidator,
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("contactName").optional().trim(),
  body("email").optional().trim().isEmail().withMessage("Must be a valid email").bail().normalizeEmail(),
  body("phone").optional().trim(),
];
