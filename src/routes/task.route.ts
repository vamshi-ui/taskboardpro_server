import express from "express";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";
import {
  deleteTask,
  getAllTasks,
  getRecentTasks,
  getTaskDetails,
  insertTask,
  updateTask,
} from "../controllers/task.controller";
import { authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/create-task",
  [
    body("taskName").notEmpty().withMessage("task name is required"),
    body("dueDate").notEmpty().withMessage("dueDate is required"),
    body("priority").notEmpty().withMessage("priority is required"),
    body("status").notEmpty().withMessage("status is required"),
    body("category").notEmpty().withMessage("category is required"),
    body("tags").notEmpty().withMessage("tags is required"),
    body("description").notEmpty().withMessage("description is required"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  insertTask
);

router.get("/get-task-list", authorize(["admin", "user"]), getAllTasks);

router.get(
  "/get-task/:taskId",
  [
    param("taskId")
      .notEmpty()
      .withMessage("Task ID is required")
      .isMongoId()
      .withMessage("Invalid Task ID format"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  getTaskDetails
);

router.put(
  "/update",
  [
    body("_id").notEmpty().withMessage("taskId is required"),
    body("taskName")
      .optional()
      .isString()
      .withMessage("taskName should be a string value"),
    body("dueDate")
      .optional()
      .isString()
      .withMessage("dueDate should be a valid date"),
    body("priority")
      .optional()
      .isIn(["high", "medium", "low"])
      .withMessage("priority should be one of 'high', 'medium', or 'low'"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage(
        "status should be one of 'pending', 'in-progress', or 'completed'"
      ),
    body("category")
      .optional()
      .isMongoId()
      .withMessage("category should be a valid MongoDB ObjectId"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("tags should be an array of tag IDs")
      .custom((tags) => tags.every((tag: any) => /^[0-9a-fA-F]{24}$/.test(tag)))
      .withMessage("Each tag should be a valid MongoDB ObjectId"),
    validateBody,
    authorize(["admin", "user"]),
  ],
  updateTask
);

router.delete(
  "/delete/:taskId",
  [param("taskId").notEmpty().withMessage("taskId is required"), validateBody],
  authorize(["admin", "user"]),
  deleteTask
);

router.post("/get-recent-tasks", authorize(["admin", "user"]), getRecentTasks);

export default router;
