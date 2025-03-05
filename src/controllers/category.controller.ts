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
    const { _id, name, description } = req.body;

    const category = await Category.findById(_id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (category.globalFlag) {
      res.status(403).json({ message: "Cannot update a global category" });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { categoryName: name, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      result: updatedCategory,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (category.globalFlag) {
      res.status(403).json({ message: "Cannot delete a global category" });
      return;
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    res
      .status(200)
      .json({
        message: "Category deleted successfully",
        result: deletedCategory,
      });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { limit, offset }: any = req.body;

    const query = Category.find({
      $or: [{ userId: req.user.id }, { globalFlag: true }],
    })
      .sort({ createdAt: -1 })
      .skip(offset ? parseInt(offset) : 0);

    if (limit) {
      query.limit(parseInt(limit));
    }

    const [categoryList, totalRecords] = await Promise.all([
      query,
      Category.countDocuments({
        $or: [{ userId: req.user.id }, { globalFlag: true }],
      }),
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
