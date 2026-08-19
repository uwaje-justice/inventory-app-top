import { matchedData } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as categoryService from "../services/categoryService.js";

export const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.user.id);
  res.json({ categories });
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  const category = await categoryService.getCategoryById(id, userId);
  res.json({ category });
});

export const create = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const userId = req.user.id;
  const category = await categoryService.createCategory(userId, data);
  res.status(201).json({ category });
});

export const update = asyncHandler(async (req, res) => {
  const { id, ...data } = matchedData(req);
  const userId = req.user.id;
  const category = await categoryService.updateCategory(id, userId, data);
  res.json({ category });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  await categoryService.deleteCategory(id, userId);
  res.status(204).end();
});
