import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as categoryController from "../controllers/categoryController.js";

import {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/categoryValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", categoryController.list);
router.get("/:id", categoryIdParamValidator, validate, categoryController.getById);
router.post("/", createCategoryValidator, validate, categoryController.create);
router.put("/:id", updateCategoryValidator, validate, categoryController.update);
router.delete("/:id", categoryIdParamValidator, validate, categoryController.remove);

export default router;
