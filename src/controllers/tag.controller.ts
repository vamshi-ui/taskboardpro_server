import { Request, Response } from "express";
import { Itag, Tag } from "../models/task.model";

export const insertTag = async (req: Request, res: Response) => {
  try {
    const { tagName, description }: Itag = req.body;
    const tag: Itag = new Tag({
      tagName,
      description,
    });
    const newTag = await tag.save();
    res.status(200).json({
      message: "success",
      result: newTag,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal server error",
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
        return res.status(404).json({ message: "Tag not found" });
      }
  
      res.status(200).json({
        message: "Tag updated successfully",
        result: updatedTag,
      });
    } catch (err: any) {
      console.log(err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const deleteTag = async (req: Request, res: Response) => {
    try {
      const { tagId } = req.params;
  
      const deletedTag = await Tag.findByIdAndDelete(tagId);
  
      if (!deletedTag) {
        return res.status(404).json({ message: "Tag not found" });
      }
  
      res.status(200).json({ message: "Tag deleted successfully" });
    } catch (err: any) {
      console.log(err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
