import db from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

export const getItems = async (userId, filters = {}) => {
  const where = { userId };

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.supplierId) {
    where.supplierId = filters.supplierId;
  }

  return db.item.findMany({
    where,
    include: { category: true, supplier: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getItemById = async (id, userId) => {
  const item = await db.item.findFirst({
    where: { id, userId },
    include: {
      category: true,
      supplier: true,
      vehicles: { include: { vehicle: true } },
    },
  });

  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return item;
};

export const createItem = async (userId, data) => {
  return db.item.create({
    data: { ...data, userId },
    include: { category: true, supplier: true },
  });
};

export const updateItem = async (id, userId, data) => {
  const item = await db.item.findFirst({ where: { id, userId } });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return db.item.update({
    where: { id },
    data,
    include: { category: true, supplier: true },
  });
};

export const deleteItem = async (id, userId) => {
  const item = await db.item.findFirst({ where: { id, userId } });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return db.item.delete({ where: { id } });
};
