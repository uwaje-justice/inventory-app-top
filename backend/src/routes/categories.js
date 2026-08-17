import { Router } from "express";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import {
  list,
  getById,
  create,
  update,
  remove,
} from "../controllers/categoryController.js";

const router = Router();

const idParamValidation = [
  param("id").isUUID().withMessage("Invalid category ID"),
];

const createValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
];

const updateValidation = [
  ...idParamValidation,
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .trim(),
];

router.use(authenticate);

router.get("/", list);
router.get("/:id", idParamValidation, validate, getById);
router.post("/", createValidation, validate, create);
router.put("/:id", updateValidation, validate, update);
router.delete("/:id", idParamValidation, validate, remove);

export default router;
