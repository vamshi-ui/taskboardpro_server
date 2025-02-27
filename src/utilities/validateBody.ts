import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body)
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).json({ errors: errors.array() });
  }
};
