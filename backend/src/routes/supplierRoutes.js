import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as supplierController from "../controllers/supplierController.js";
import {
  supplierIdParam,
  createSupplierValidation,
  updateSupplierValidation,
} from "../validators/supplierValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", supplierController.list);
router.get("/:id", supplierIdParam, validate, supplierController.getById);
router.post("/", createSupplierValidation, validate, supplierController.create);
router.put("/:id", updateSupplierValidation, validate, supplierController.update);
router.delete("/:id", supplierIdParam, validate, supplierController.remove);

export default router;
