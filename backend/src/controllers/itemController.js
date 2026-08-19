import { matchedData } from "express-validator";
import * as itemService from "../services/itemService.js";

export const list = async (req, res) => {
  const { categoryId, supplierId } = req.query;
  const userId = req.user.id;
  const items = await itemService.getItems(userId, { categoryId, supplierId });
  res.json({ items });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  const item = await itemService.getItemById(id, userId);
  res.json({ item });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const userId = req.user.id;
  const item = await itemService.createItem(userId, data);
  res.status(201).json({ item });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const userId = req.user.id;
  const item = await itemService.updateItem(id, userId, data);
  res.json({ item });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  await itemService.deleteItem(id, userId);
  res.status(204).end();
};
