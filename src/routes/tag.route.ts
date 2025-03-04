import express from "express";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";
import {
  deleteTag,
  getAllTags,
  insertTag,
  updateTag,
} from "../controllers/tag.controller";
import { authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/insert-tag",
  [
    body("name").notEmpty().withMessage("tag name is required"),
    body("description").notEmpty().withMessage("description is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  insertTag
);

router.put(
  "/update",
  [
    body("_id").notEmpty().withMessage("tagId is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  updateTag
);

router.delete(
  "/delete/:tagId",
  [
    param("tagId").notEmpty().withMessage("tagId is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  deleteTag
);

router.post("/get-all-tags", authorize(["admin", "user"]), getAllTags);

export default router;
