import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const hashPassword = (password: string) => {
  return hashSync(password, 10);
};

export const comparePassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateAccessToken = (payload: any) => {
  if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET not found");

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: any) => {
  if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET not found");

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET not found");

  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  if (!REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET not found");

  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
