import { matchedData } from "express-validator";
import * as vehicleService from "../services/vehicleService.js";

export const list = async (req, res) => {
  const vehicles = await vehicleService.getVehicles(req.user.id);
  res.json({ vehicles });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const vehicle = await vehicleService.getVehicleById(id, req.user.id);
  res.json({ vehicle });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const vehicle = await vehicleService.createVehicle(req.user.id, data);
  res.status(201).json({ vehicle });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const vehicle = await vehicleService.updateVehicle(id, req.user.id, data);
  res.json({ vehicle });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  await vehicleService.deleteVehicle(id, req.user.id);
  res.status(204).end();
};

export const addItem = async (req, res) => {
  const { id, itemId } = matchedData(req);
  await vehicleService.addCompatibleItem(id, req.user.id, itemId);
  res.status(201).json({ message: "Item added to vehicle" });
};

export const removeItem = async (req, res) => {
  const { id, itemId } = matchedData(req);
  await vehicleService.removeCompatibleItem(id, req.user.id, itemId);
  res.status(204).end();
};
