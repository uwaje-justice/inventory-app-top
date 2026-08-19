import { matchedData } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as supplierService from "../services/supplierService.js";

export const list = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const suppliers = await supplierService.getSuppliers(userId);
  res.json({ suppliers });
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  const supplier = await supplierService.getSupplierById(id, userId);
  res.json({ supplier });
});

export const create = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const userId = req.user.id;
  const supplier = await supplierService.createSupplier(userId, data);
  res.status(201).json({ supplier });
});

export const update = asyncHandler(async (req, res) => {
  const { id, ...data } = matchedData(req);
  const userId = req.user.id;
  const supplier = await supplierService.updateSupplier(id, userId, data);
  res.json({ supplier });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  await supplierService.deleteSupplier(id, userId);
  res.status(204).end();
});
