import { compare, hash } from "bcryptjs";
import User from "../models/User.js";
import { NextFunction, Request, Response } from "express";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import mongoose from "mongoose";

// ✅ Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "ok", users });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// ✅ Signup
export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already registered" });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // ✅ Clear any existing cookie first
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    // ✅ Create JWT token
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // ✅ Set secure cookie (Render HTTPS)
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      expires,
    });

    return res.status(201).json({ message: "ok", name: user.name });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// ✅ Login
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    // ✅ Clear old cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    // ✅ Create new JWT token
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // ✅ Set secure cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      expires,
    });

    return res.status(200).json({ message: "ok", name: user.name, email: user.email });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// ✅ Verify user (for /auth-status)
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.jwtData.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not registered or Token malfunctioned" });
    }

    if (user._id.toString() !== userId) {
      return res.status(401).json({ message: "Permission didn't match" });
    }

    return res.status(200).json({ message: "ok", name: user.name, email: user.email });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// ✅ Logout
export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.jwtData.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not registered or Token malfunctioned" });
    }

    if (user._id.toString() !== userId) {
      return res.status(401).json({ message: "Permission didn't match" });
    }

    // ✅ Clear secure cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    return res.status(200).json({ message: "ok", name: user.name, email: user.email });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
