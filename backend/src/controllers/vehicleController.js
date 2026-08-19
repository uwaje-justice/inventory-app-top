import { matchedData } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as vehicleService from "../services/vehicleService.js";

export const list = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const vehicles = await vehicleService.getVehicles(userId);
  res.json({ vehicles });
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.getVehicleById(id, userId);
  res.json({ vehicle });
});

export const create = asyncHandler(async (req, res) => {
  const data = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.createVehicle(userId, data);
  res.status(201).json({ vehicle });
});

export const update = asyncHandler(async (req, res) => {
  const { id, ...data } = matchedData(req);
  const userId = req.user.id;
  const vehicle = await vehicleService.updateVehicle(id, userId, data);
  res.json({ vehicle });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.deleteVehicle(id, userId);
  res.status(204).end();
});

export const addItem = asyncHandler(async (req, res) => {
  const { id, itemId } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.addCompatibleItem(id, userId, itemId);
  res.status(201).json({ message: "Item added to vehicle" });
});

export const removeItem = asyncHandler(async (req, res) => {
  const { id, itemId } = matchedData(req);
  const userId = req.user.id;
  await vehicleService.removeCompatibleItem(id, userId, itemId);
  res.status(204).end();
});
