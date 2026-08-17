import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../lib/db.js";
import { ConflictError, AuthenticationError } from "../utils/errors.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

export const signToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerUser = async ({ username, email, password }) => {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { username, email, password: hashed },
  });

  const token = signToken(user);

  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const token = signToken(user);

  return { user: sanitizeUser(user), token };
};
