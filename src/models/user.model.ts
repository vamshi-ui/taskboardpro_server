import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";

// Main User Interface and Schema
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailId: string;
  password: string;
  role: "user" | "admin";
  isActive: boolean;
  validatePassword(value: string): Promise<boolean>;
  generateJWT(): Promise<string>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      validate: {
        validator: (value: string) =>
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(value),
        message: "Invalid mobile number format",
      },
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
    },
    process.env.JWT_SECRET!,
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
