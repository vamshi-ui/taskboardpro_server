import express from "express";
import {
  deleteCategory,
  getAllCategories,
  insertCategory,
  updateCategory,
} from "../controllers/category.controller";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";
import { authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/insert-category",
  [
    body("name").notEmpty().withMessage("category name is required"),
    body("description").notEmpty().withMessage("description is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  insertCategory
);

router.put(
  "/update",
  [
    body("_id").notEmpty().withMessage("categoryId is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  updateCategory
);

router.delete(
  "/delete/:categoryId",
  [
    param("categoryId").notEmpty().withMessage("categoryId is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  deleteCategory
);

router.post("/get-all-categories",  authorize(["admin", "user"]), getAllCategories);

export default router;
