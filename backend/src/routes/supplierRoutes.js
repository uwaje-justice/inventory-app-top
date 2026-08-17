import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as supplierController from "../controllers/supplierController.js";
import {
  supplierIdParamValidator,
  createSupplierValidator,
  updateSupplierValidator,
} from "../validators/supplierValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", supplierController.list);
router.get("/:id", supplierIdParamValidator, validate, supplierController.getById);
router.post("/", createSupplierValidator, validate, supplierController.create);
router.put("/:id" ,updateSupplierValidator, validate, supplierController.update);
router.delete("/:id", supplierIdParamValidator, validate, supplierController.remove);

export default router;
