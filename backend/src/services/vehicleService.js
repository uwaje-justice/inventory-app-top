import db from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

export const getVehicles = async (userId) => {
  return db.vehicle.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getVehicleById = async (id, userId) => {
  const vehicle = await db.vehicle.findFirst({
    where: { id, userId },
    include: { items: { include: { item: true } } },
  });

  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  return vehicle;
};

export const createVehicle = async (userId, data) => {
  return db.vehicle.create({
    data: { ...data, userId },
  });
};

export const updateVehicle = async (id, userId, data) => {
  const vehicle = await db.vehicle.findFirst({ where: { id, userId } });
  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  return db.vehicle.update({
    where: { id },
    data,
  });
};

export const deleteVehicle = async (id, userId) => {
  const vehicle = await db.vehicle.findFirst({ where: { id, userId } });
  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  return db.vehicle.delete({ where: { id } });
};

export const addCompatibleItem = async (vehicleId, userId, itemId) => {
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId } });
  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  const item = await db.item.findFirst({ where: { id: itemId, userId } });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return db.itemVehicle.upsert({
    where: { itemId_vehicleId: { itemId, vehicleId } },
    create: { itemId, vehicleId },
    update: {},
  });
};

export const removeCompatibleItem = async (vehicleId, userId, itemId) => {
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, userId } });
  if (!vehicle) {
    throw new NotFoundError("Vehicle not found");
  }

  return db.itemVehicle.delete({
    where: { itemId_vehicleId: { itemId, vehicleId } },
  });
};
