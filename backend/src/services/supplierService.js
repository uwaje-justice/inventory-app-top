import db from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

export const getSuppliers = async (userId) => {
  return db.supplier.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getSupplierById = async (id, userId) => {
  const supplier = await db.supplier.findFirst({
    where: { id, userId },
    include: { items: true },
  });

  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }

  return supplier;
};

export const createSupplier = async (userId, data) => {
  return db.supplier.create({
    data: { ...data, userId },
  });
};

export const updateSupplier = async (id, userId, data) => {
  const supplier = await db.supplier.findFirst({ where: { id, userId } });
  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }

  return db.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id, userId) => {
  const supplier = await db.supplier.findFirst({ where: { id, userId } });
  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }

  return db.supplier.delete({ where: { id } });
};
