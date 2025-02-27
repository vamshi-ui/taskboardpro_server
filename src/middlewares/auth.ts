import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/user.model";

interface IDecodedToken {
  emailId: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}

export const authorize = (allowedUserRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.cookies["auth-key"];

    if (!token) {
      res.status(401).json({ message: "Unauthorized", result: null });
      return;
    }

    try {
      const decodedToken: IDecodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as IDecodedToken;

      const user = await User.findOne({ emailId: decodedToken.emailId });
      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;

      if (!allowedUserRoles.includes(decodedToken.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
  };
};
