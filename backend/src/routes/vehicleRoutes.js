import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as vehicleController from "../controllers/vehicleController.js";
import {
  vehicleIdParam,
  createVehicleValidation,
  updateVehicleValidation,
  addItemValidation,
  removeItemValidation,
} from "../validators/vehicleValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", vehicleController.list);
router.get("/:id", vehicleIdParam, validate, vehicleController.getById);
router.post("/", createVehicleValidation, validate, vehicleController.create);
router.put("/:id", updateVehicleValidation, validate, vehicleController.update);
router.delete("/:id", vehicleIdParam, validate, vehicleController.remove);
router.post("/:id/items", addItemValidation, validate, vehicleController.addItem);
router.delete("/:id/items/:itemId", removeItemValidation, validate, vehicleController.removeItem);

export default router;
