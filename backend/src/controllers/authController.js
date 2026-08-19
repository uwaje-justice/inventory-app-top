import { matchedData } from "express-validator";
import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  const data = matchedData(req);
  const result = await authService.registerUser(data);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const data = matchedData(req);
  const result = await authService.loginUser(data);
  res.json(result);
};

export const me = (req, res) => {
  res.json({ user: req.user });
};
