import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedOwnerRequest extends Request {
  owner?: {
    role: "owner";
  };
}

export function requireOwnerAuth(req: AuthenticatedOwnerRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required"
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { role: "owner" };
    req.owner = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authorization token"
    });
  }
}
