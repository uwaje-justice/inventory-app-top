import { matchedData } from "express-validator";
import * as categoryService from "../services/categoryService.js";

export const list = async (req, res) => {
  const categories = await categoryService.getCategories(req.user.id);
  res.json({ categories });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const category = await categoryService.getCategoryById(id, req.user.id);
  res.json({ category });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const category = await categoryService.createCategory(req.user.id, data);
  res.status(201).json({ category });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const category = await categoryService.updateCategory(id, req.user.id, data);
  res.json({ category });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  await categoryService.deleteCategory(id, req.user.id);
  res.status(204).end();
};
