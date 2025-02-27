import express from "express";
import { body, param } from "express-validator";
import { validateBody } from "../utilities/validateBody";
import {
  getAllTasks,
  getTaskDetails,
  insertTask,
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

export default router;
