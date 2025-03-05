import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import validator from "validator";
import { Token } from "../models/token.model";
import { sendEmail } from "../utilities/sendEmail";
import { verifyEmailBody } from "../constants/emailbody";

export const insertUser = async (req: Request, res: Response) => {
  const { userName, password, role, emailId } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser && !existingUser.isEmailVerified) {
      const newToken = crypto.randomUUID();
      await Token.findOneAndUpdate(
        { userId: existingUser._id },
        {
          token: newToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
      );

      const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email/${newToken}`;
      await sendEmail(
        emailId,
        "Verify Your Email Address",
        verifyEmailBody(verificationLink),
        verifyEmailBody(verificationLink)
      );

      res.status(400).json({
        message:
          "User already exists but email is not verified. Verification link resent.",
      });
      return;
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400).json({ message: "Please enter a strong password" });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      password: hashPassword,
      role,
      emailId,
    });
    const user = await newUser.save();

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const token = new Token({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await token.save();

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email/${verificationToken}`;
    await sendEmail(
      emailId,
      "Verify Your Email Address",
      verifyEmailBody(verificationLink),
      verifyEmailBody(verificationLink)
    );

    res.status(200).json({
      message: "User data saved successfully. Verification email sent.",
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
  try {
    const { emailId, password } = req.body;
    console.log(req.body);

    if (validator.isEmpty(emailId) || validator.isEmpty(password)) {
      throw new Error("Please provide both username and password");
    }
    const user: any = (await User.findOne({ emailId })) as IUser;

    if (!user) {
      throw new Error(
        "you are not authorized user to login, please signup & try again"
      );
    } else if (!user.isEmailVerified) {
      throw new Error("please verify your email & then try again to login...");
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
      userName: user?.userName,
      emailId: user?.emailId,
      joinedDate: user?.createdAt,
      role: user?.role,
    };
    res.status(200).json({ message: "login sucsess", userData });
  } catch (err: any) {
    res.status(400).json({ message: err.message, result: null });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth-key");
  res.json({ message: "logout successfull !!" });
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const foundToken = await Token.findOne({ token });

    if (!foundToken) {
      res.render("emailVerificationError", {
        message:
          "Invalid or expired token. Please request a new verification link.",
      });
      return;
    }

    const user = await User.findById(foundToken.userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (user.isEmailVerified) {
      res.render("emailVerified", {
        loginUrl: `${process.env.CLIENT_URL}/login`,
      });
      return;
    }

    user.isEmailVerified = true;
    await user.save();
    await Token.findByIdAndDelete(foundToken._id);

    res.render("emailVerified", {
      loginUrl: `${process.env.CLIENT_URL}/login`,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
