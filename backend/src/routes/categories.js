import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as categoryController from "../controllers/categoryController.js";
import {
  categoryIdParam,
  createCategoryValidation,
  updateCategoryValidation,
} from "../validators/categoryValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", categoryController.list);
router.get("/:id", categoryIdParam, validate, categoryController.getById);
router.post("/", createCategoryValidation, validate, categoryController.create);
router.put("/:id", updateCategoryValidation, validate, categoryController.update);
router.delete("/:id", categoryIdParam, validate, categoryController.remove);

export default router;
