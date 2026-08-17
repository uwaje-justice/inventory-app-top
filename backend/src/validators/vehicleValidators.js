import { body, param } from "express-validator";
import { idParam } from "./index.js";

export const vehicleIdParamValidator = idParam("vehicle");

export const itemIdParamValidator = [param("itemId").isUUID().withMessage("Invalid item ID")];

export const createVehicleValidator = [
  body("make").trim().notEmpty().withMessage("Make is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("year").notEmpty().withMessage("Year is required").isInt({ min: 1886 }).withMessage("Year must be a valid year"),
];

export const updateVehicleValidator = [
  ...vehicleIdParamValidator,
  body("make").trim().notEmpty().withMessage("Make is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("year").notEmpty().withMessage("Year is required").isInt({ min: 1886 }).withMessage("Year must be a valid year"),
];

export const addItemValidator = [
  ...vehicleIdParamValidator,
  body("itemId").notEmpty().withMessage("Item ID is required").isUUID().withMessage("Invalid item ID"),
];

export const removeItemValidator = [...vehicleIdParamValidator, ...itemIdParamValidator];
