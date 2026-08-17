import db from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

export const getCategories = async (userId) => {
  return db.category.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id, userId) => {
  const category = await db.category.findFirst({
    where: { id, userId },
    include: { items: true },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const createCategory = async (userId, { name, description }) => {
  return db.category.create({
    data: { name, description, userId },
  });
};

export const updateCategory = async (id, userId, { name, description }) => {
  const category = await db.category.findFirst({ where: { id, userId } });
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return db.category.update({
    where: { id },
    data: { name, description },
  });
};

export const deleteCategory = async (id, userId) => {
  const category = await db.category.findFirst({ where: { id, userId } });
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return db.category.delete({ where: { id } });
};
