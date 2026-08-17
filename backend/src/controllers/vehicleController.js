import { matchedData } from "express-validator";
import * as vehicleService from "../services/vehicleService.js";

export const list = async (req, res) => {
  const userId = req.user.id;
  const vehicles = await vehicleService.getVehicles(userId);
  res.json({ vehicles });
};

export const getById = async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.getVehicleById(id, userId);
  res.json({ vehicle });
};

export const create = async (req, res) => {
  const data = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.createVehicle(userId, data);
  res.status(201).json({ vehicle });
};

export const update = async (req, res) => {
  const { id, ...data } = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.updateVehicle(id, userId, data);
  res.json({ vehicle });
};

export const remove = async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.deleteVehicle(id, userId);
  res.status(204).end();
};

export const addItem = async (req, res) => {
  const { id, itemId } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.addCompatibleItem(id, userId, itemId);
  res.status(201).json({ message: "Item added to vehicle" });
};

export const removeItem = async (req, res) => {
  const { id, itemId } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.removeCompatibleItem(id, userId, itemId);
  res.status(204).end();
};
