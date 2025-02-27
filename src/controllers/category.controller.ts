import { Request, Response } from "express";
import { ICategory, Category } from "../models/task.model";

export const insertCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, description }: ICategory = req.body;
    const category: ICategory = new Category({
      categoryName,
      description,
    });
    const newcategory = await category.save();
    res.status(200).json({
      message: "success",
      result: newcategory,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: err.message || "internal server error",
    });
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, description }: ICategory = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
       res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      result: updatedCategory,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
       res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};
