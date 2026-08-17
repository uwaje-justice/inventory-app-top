import { matchedData } from "express-validator";
import * as itemService from "../services/itemService.js";

export const list = async (req, res) => {
  const { categoryId, supplierId } = req.query;
  const items = await itemService.getItems(req.user.id, { categoryId, supplierId });
  res.json({ items });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const item = await itemService.getItemById(id, req.user.id);
  res.json({ item });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const item = await itemService.createItem(req.user.id, data);
  res.status(201).json({ item });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const item = await itemService.updateItem(id, req.user.id, data);
  res.json({ item });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  await itemService.deleteItem(id, req.user.id);
  res.status(204).end();
};
