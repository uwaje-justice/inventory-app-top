import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import * as authController from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/me", authenticate, authController.me);

export default router;
