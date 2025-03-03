import { Request, Response } from "express";
import { ICategory, Category } from "../models/task.model";

export const insertCategory = async (req: Request, res: Response) => {
  try {
    console.log(req.user);

    const { name, description } = req.body;
    const category: ICategory = new Category({
      categoryName: name,
      description,
      userId: req.user.id,
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
      return;
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
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { limit, offset }: any = req.body;

    const query = Category.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(offset ? parseInt(offset) : 0);

    if (limit) {
      query.limit(parseInt(limit));
    }

    const [categoryList, totalRecords] = await Promise.all([
      query,
      Category.countDocuments({ userId: req.user.id }),
    ]);

    res.status(200).json({
      message: "success",
      result: categoryList,
      totalRecords,
      offset: +offset,
    });

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};
