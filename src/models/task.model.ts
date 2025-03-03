import mongoose, { Schema, Model, Document } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  dueDate: Date;
  priority: string;
  status: string;
  category: mongoose.Schema.Types.ObjectId;
  tags: mongoose.Schema.Types.ObjectId[];
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface ICategory extends Document {
  categoryName: string;
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface Itag extends Document {
  tagName: string;
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema<ITask> = new Schema<ITask>(
  {
    taskName: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "completed"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Tag",
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const tagSchema: Schema<Itag> = new Schema<Itag>(
  {
    tagName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

TaskSchema.pre("save", async function (next) {
  const categoryExists = await Category.exists({ _id: this.category });
  if (!categoryExists) {
    throw new Error("Category ID is invalid");
  }

  const validTags = await Tag.find({ _id: { $in: this.tags } });

  if (validTags.length !== this.tags.length) {
    throw new Error("One or more tag IDs are invalid");
  }

  next();
});

const Category: Model<ICategory> = mongoose.model("Category", categorySchema);
const Tag: Model<Itag> = mongoose.model("Tag", tagSchema);
const Task: Model<ITask> = mongoose.model("Task", TaskSchema);

export { Category, Task, Tag };
