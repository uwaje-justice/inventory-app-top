import { body, param } from "express-validator";
import { idParam } from "./index.js";

export const vehicleIdParam = idParam("vehicle");

export const itemIdParam = [
  param("itemId").isUUID().withMessage("Invalid item ID"),
];

export const createVehicleValidation = [
  body("make")
    .trim()
    .notEmpty().withMessage("Make is required"),
  body("model")
    .trim()
    .notEmpty().withMessage("Model is required"),
  body("year")
    .notEmpty().withMessage("Year is required")
    .isInt({ min: 1886 }).withMessage("Year must be a valid year"),
];

export const updateVehicleValidation = [
  ...vehicleIdParam,
  body("make")
    .trim()
    .notEmpty().withMessage("Make is required"),
  body("model")
    .trim()
    .notEmpty().withMessage("Model is required"),
  body("year")
    .notEmpty().withMessage("Year is required")
    .isInt({ min: 1886 }).withMessage("Year must be a valid year"),
];

export const addItemValidation = [
  ...vehicleIdParam,
  body("itemId")
    .notEmpty().withMessage("Item ID is required")
    .isUUID().withMessage("Invalid item ID"),
];

export const removeItemValidation = [
  ...vehicleIdParam,
  ...itemIdParam,
];
