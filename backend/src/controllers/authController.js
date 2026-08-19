import { matchedData } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const result = await authService.registerUser(data);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const result = await authService.loginUser(data);
  res.json(result);
});

export const me = (req, res) => {
  res.json({ user: req.user });
};
