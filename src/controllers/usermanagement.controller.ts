import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import validator from "validator";

export const insertUser = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    password,
    role,
    emailId,
  } = req.body;
  try {
    if (!validator.isStrongPassword(password)) {
      res.status(400).json({ message: "Please enter a strong password" });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      password: hashPassword,
      role,
      emailId,
    });
    const user = await newUser.save();
    res.status(200).json({
      message: "user data saved successfully",
      result: user,
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
      result: null,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { emailId, password } = req.body;

  if (validator.isEmpty(emailId) || validator.isEmpty(password)) {
    throw new Error("Please provide both username and password");
  }

  try {
    const user: IUser = (await User.findOne({ emailId })) as IUser;

    if (!user) {
      throw new Error("you are not authorized user to login");
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = await user.generateJWT();
    res.cookie("auth-key", token, {
      expires: new Date(Date.now() + 100000 * 60),
    });

    const userData = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      emailId: user?.emailId,
    };
    res
      .status(200)
      .json({ message: "login sucsess", userData });
  } catch (err: any) {
    res.status(400).json({ message: err.message, result: null });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth-key");
  res.json({ message: "logout successfull !!" });
};
