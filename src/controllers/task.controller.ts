import { Request, Response } from "express";
import { ITask, Task } from "../models/task.model";

export const insertTask = async (req: Request, res: Response) => {
  try {
    const {
      taskName,
      dueDate,
      priority,
      status,
      category,
      tags,
      description,
    }: ITask = req.body;

    const task = new Task({
      taskName,
      dueDate,
      priority,
      status,
      category,
      tags,
      description,
      userId: req.user.id,
    });

    const newTask = await task.save();

    res.status(200).json({
      message: "success",
      result: newTask,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: err.message || "internal server error",
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const taskList = await Task.find({ userId: req.user.id }).populate([
      "category",
      "tags",
      "userId",
    ]);
    res.status(200).send({
      result: taskList,
      message: "success",
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "internal server error",
    });
  }
};

export const getTaskDetails = async (req: Request, res: Response) => {
  try {
    const taskDetails = await Task.findById(req.params.taskId).populate([
      "category",
      "tags",
      "userId",
    ]);
    res.status(taskDetails ? 200 : 204).send({
      result: taskDetails || {},
      message: "success",
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "internal server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updatedTaskData: Partial<ITask> = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      updatedTaskData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
       res.status(404).json({ message: "Task not found" });
       return
    }

    res.status(200).json({
      message: "Task updated successfully",
      result: updatedTask,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user.id,
    });

    if (!deletedTask) {
       res.status(404).json({ message: "Task not found" });
       return
    }

    res.status(200).json({
      message: "Task deleted successfully",
      result: deletedTask,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};
