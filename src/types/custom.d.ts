import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user: any;  // Define the user type based on your JWT payload structure
    }
  }
}