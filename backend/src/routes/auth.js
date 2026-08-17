import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import { register, login, me } from "../controllers/authController.js";

const router = Router();

const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email").bail()
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email").bail()
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", authenticate, me);

export default router;
