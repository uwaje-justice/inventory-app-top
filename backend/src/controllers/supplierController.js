import { matchedData } from "express-validator";
import * as supplierService from "../services/supplierService.js";

export const list = async (req, res) => {
  const suppliers = await supplierService.getSuppliers(req.user.id);
  res.json({ suppliers });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const supplier = await supplierService.getSupplierById(id, req.user.id);
  res.json({ supplier });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const supplier = await supplierService.createSupplier(req.user.id, data);
  res.status(201).json({ supplier });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const supplier = await supplierService.updateSupplier(id, req.user.id, data);
  res.json({ supplier });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  await supplierService.deleteSupplier(id, req.user.id);
  res.status(204).end();
};
