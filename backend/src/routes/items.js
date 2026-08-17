import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as itemController from "../controllers/itemController.js";
import { itemIdParam, createItemValidation, updateItemValidation } from "../validators/itemValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", itemController.list);
router.get("/:id", itemIdParam, validate, itemController.getById);
router.post("/", createItemValidation, validate, itemController.create);
router.put("/:id", updateItemValidation, validate, itemController.update);
router.delete("/:id", itemIdParam, validate, itemController.remove);

export default router;
