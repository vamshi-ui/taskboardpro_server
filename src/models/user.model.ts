import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Main User Interface and Schema
export interface IUser extends Document {
  userName: string;
  emailId: string;
  password: string;
  role: "user" | "admin";
  isActive: boolean;
  isEmailVerified: boolean;
  validatePassword(value: string): Promise<boolean>;
  generateJWT(): Promise<string>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "User name must be at least 2 characters"],
      maxlength: [50, "User name cannot exceed 50 characters"],
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Password validation method
userSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// JWT generation method
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      emailId: this.emailId,
      role: this.role,
      userName: this.userName,
      joinedDate: this.createdAt,
      isEmailVerified: this.isEmailVerified,
      isActive: this.isActive,
    },
    process.env.JWT_SECRET!
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
