import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/crypto";

export const checkAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken || accessToken === "undefined" || accessToken === "null") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    (
      req as unknown as {
        jwtPayload: unknown;
      }
    ).jwtPayload = payload;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
