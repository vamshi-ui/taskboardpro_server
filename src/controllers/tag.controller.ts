import { Request, Response } from "express";
import { Itag, Tag } from "../models/task.model";

export const insertTag = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const tag: Itag = new Tag({
      tagName: name,
      description,
      userId: req.user.id,
    });
    const newTag = await tag.save();
    res.status(200).json({
      message: "success",
      result: newTag,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: err.message || "internal server error",
    });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;
    const { tagName, description }: Itag = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { tagName, description },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({
      message: "Tag updated successfully",
      result: updatedTag,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const { limit, offset }: any = req.body;

    const query = Tag.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(offset ? parseInt(offset) : 0);

    if (limit) {
      query.limit(parseInt(limit));
    }

    const [TagList, totalRecords] = await Promise.all([
      query,
      Tag.countDocuments({ userId: req.user.id }),
    ]);

    res.status(200).json({
      message: "success",
      result: TagList,
      totalRecords,
      offset: +offset,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "internal server error" });
  }
};
