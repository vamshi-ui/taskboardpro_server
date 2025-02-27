import express from "express";
import {
  deleteCategory,
  insertCategory,
  updateCategory,
} from "../controllers/category.controller";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";

const router = express.Router();

router.post(
  "/insert-category",
  [
    body("categoryName").notEmpty().withMessage("category name is required"),
    body("description").notEmpty().withMessage("description is required"),
    validateBody,
  ],
  insertCategory
);

router.put(
  "/update/:categoryId",
  [
    param("categoryId").notEmpty().withMessage("categoryId is required"),
    validateBody,
  ],
  updateCategory
);

router.delete(
  "/delete/:categoryId",
  [
    param("categoryId").notEmpty().withMessage("categoryId is required"),
    validateBody,
  ],
  deleteCategory
);

export default router;
