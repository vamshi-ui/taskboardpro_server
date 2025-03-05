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
    const { _id, name, description } = req.body;

    const tag = await Tag.findById(_id);

    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    if (tag.globalFlag) {
      res.status(403).json({ message: "Cannot update a global tag" });
      return;
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      _id,
      { tagName: name, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Tag updated successfully",
      result: updatedTag,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = req.params;

    const tag = await Tag.findById(tagId);

    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    if (tag.globalFlag) {
      res.status(403).json({ message: "Cannot delete a global tag" });
      return;
    }

    const deletedTag = await Tag.findByIdAndDelete(tagId);

    res.status(200).json({
      message: "Tag deleted successfully",
      result: deletedTag,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};


export const getAllTags = async (req: Request, res: Response) => {
  try {
    const { limit, offset }: any = req.body;

    const query = Tag.find({
      $or: [{ userId: req.user.id }, { globalFlag: true }],
    })
      .sort({ createdAt: -1 })
      .skip(offset ? parseInt(offset) : 0);

    if (limit) {
      query.limit(parseInt(limit));
    }

    const [TagList, totalRecords] = await Promise.all([
      query,
      Tag.countDocuments({
        $or: [{ userId: req.user.id }, { globalFlag: true }],
      }),
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
