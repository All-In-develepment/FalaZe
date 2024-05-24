import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import AppError from "../errors/AppError";

dotenv.config();
export const isAuthWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const [, token] = authHeader.split(" ");

  if (token !== process.env.WEBHOOK_HASH)
    throw new AppError("ERR_TOKEN_INVALID", 401);

  return next();
};
