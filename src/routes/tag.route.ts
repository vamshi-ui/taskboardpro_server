import express from "express";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";
import { deleteTag, insertTag, updateTag } from "../controllers/tag.controller";

const router = express.Router();

router.post(
  "/insert-tag",
  [
    body("tagName").notEmpty().withMessage("tag name is required"),
    body("description").notEmpty().withMessage("description is required"),
    validateBody,
  ],
  insertTag
);

router.put(
  "/update/:tagId",
  [param("tagId").notEmpty().withMessage("tagId is required"), validateBody],
  updateTag
);

router.delete(
  "/delete/:tagId",
  [param("tagId").notEmpty().withMessage("tagId is required"), validateBody],
  deleteTag
);

export default router;
