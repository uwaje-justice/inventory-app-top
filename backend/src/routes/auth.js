import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as authController from "../controllers/authController.js";
import { registerValidation, loginValidation } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.get("/me", authenticate, authController.me);

export default router;
