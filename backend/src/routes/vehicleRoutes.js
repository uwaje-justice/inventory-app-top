import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as vehicleController from "../controllers/vehicleController.js";
import {
  vehicleIdParamValidator,
  createVehicleValidator,
  updateVehicleValidator,
  addItemValidator,
  removeItemValidator,
} from "../validators/vehicleValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", vehicleController.list);
router.get("/:id", vehicleIdParamValidator, validate, vehicleController.getById);
router.post("/", createVehicleValidator, validate, vehicleController.create);
router.put("/:id", updateVehicleValidator, validate, vehicleController.update);
router.delete("/:id", vehicleIdParamValidator, validate, vehicleController.remove);
router.post("/:id/items", addItemValidator, validate, vehicleController.addItem);
router.delete("/:id/items/:itemId", removeItemValidator, validate, vehicleController.removeItem);

export default router;
