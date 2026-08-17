import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as itemController from "../controllers/itemController.js";
import { itemIdParamValidator, createItemValidator, updateItemValidator } from "../validators/itemValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", itemController.list);
router.get("/:id", itemIdParamValidator, validate, itemController.getById);
router.post("/", createItemValidator, validate, itemController.create);
router.put("/:id", updateItemValidator, validate, itemController.update);
router.delete("/:id", itemIdParamValidator, validate, itemController.remove);

export default router;
