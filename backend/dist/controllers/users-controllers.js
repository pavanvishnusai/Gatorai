// import { compare, hash } from "bcryptjs";
// import User from "../models/User.js";
// import { NextFunction, Request, Response } from "express";
// import { createToken } from "../utils/token-manager.js";
// import { COOKIE_NAME } from "../utils/constants.js";
// import mongoose from "mongoose";
// // Determine environment (Render vs Local)
// const isProduction = process.env.NODE_ENV === "production";
// const sameSiteMode = isProduction ? "none" : "lax";
// const secureFlag = isProduction ? true : false;
// // ✅ Get all users
// export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await User.find();
//     return res.status(200).json({ message: "ok", users });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };
// // ✅ Signup
// export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(401).json({ message: "User already registered" });
//     }
//     const hashedPassword = await hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
//     // ✅ Clear any existing cookie
//     res.clearCookie(COOKIE_NAME, {
//       httpOnly: true,
//       sameSite: sameSiteMode,
//       secure: secureFlag,
//       path: "/",
//     });
//     // ✅ Create JWT token
//     const token = createToken(user._id.toString(), user.email, "7d");
//     const expires = new Date();
//     expires.setDate(expires.getDate() + 7);
//     // ✅ Set cookie with correct flags for environment
//     res.cookie(COOKIE_NAME, token, {
//       httpOnly: true,
//       sameSite: sameSiteMode,
//       secure: secureFlag,
//       path: "/",
//       expires,
//     });
//     return res.status(201).json({ message: "ok", name: user.name });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };
// // ✅ Login
// export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User not registered" });
//     }
//     const isPasswordCorrect = await compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(403).json({ message: "Incorrect password" });
//     }
//     // ✅ Clear old cookie
//     res.clearCookie(COOKIE_NAME, {
//       httpOnly: true,
//       sameSite: sameSiteMode,
//       secure: secureFlag,
//       path: "/",
//     });
//     // ✅ Create new JWT token
//     const token = createToken(user._id.toString(), user.email, "7d");
//     const expires = new Date();
//     expires.setDate(expires.getDate() + 7);
//     // ✅ Set secure cookie
//     res.cookie(COOKIE_NAME, token, {
//       httpOnly: true,
//       sameSite: sameSiteMode,
//       secure: secureFlag,
//       path: "/",
//       expires,
//     });
//     return res.status(200).json({ message: "ok", name: user.name, email: user.email });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };
// // ✅ Verify user (for /auth-status)
// export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = res.locals.jwtData.id;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ message: "User not registered or Token malfunctioned" });
//     }
//     if (user._id.toString() !== userId) {
//       return res.status(401).json({ message: "Permission didn't match" });
//     }
//     return res.status(200).json({ message: "ok", name: user.name, email: user.email });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };
// // ✅ Logout
// export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = res.locals.jwtData?.id;
//     // No token / invalid token scenario
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ message: "User not registered or Token malfunctioned" });
//     }
//     // ✅ Clear cookie correctly
//     res.clearCookie(COOKIE_NAME, {
//       httpOnly: true,
//       sameSite: sameSiteMode,
//       secure: secureFlag,
//       path: "/",
//     });
//     return res.status(200).json({ message: "Logout successful" });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };
import { compare, hash } from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import mongoose from "mongoose";
// ✅ Detect environment (Render vs Local)
const isProduction = process.env.NODE_ENV === "production";
const sameSiteMode = isProduction ? "none" : "lax";
const secureFlag = isProduction; // true only in production (HTTPS)
// ✅ Helper: Common cookie options
const cookieOptions = {
    httpOnly: true,
    sameSite: sameSiteMode,
    secure: secureFlag,
    path: "/",
};
// ✅ Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    }
    catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
// ✅ Signup
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User already registered" });
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // ✅ Clear existing cookie if any
        res.clearCookie(COOKIE_NAME, cookieOptions);
        // ✅ Create JWT token
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        // ✅ Set cookie securely
        res.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            expires,
        });
        return res.status(201).json({
            message: "Signup successful",
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
// ✅ Login
export const userLogin = async (req, res, next) => {
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
        // ✅ Clear previous cookie if any
        res.clearCookie(COOKIE_NAME, cookieOptions);
        // ✅ Create new token
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        // ✅ Set secure cookie
        res.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            expires,
        });
        return res.status(200).json({
            message: "Login successful",
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
// ✅ Verify user (for /auth-status)
export const verifyUser = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData?.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }
        return res.status(200).json({
            message: "ok",
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        console.error("Verify user error:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
// ✅ Logout
export const userLogout = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData?.id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }
        // ✅ Properly clear cookie
        res.clearCookie(COOKIE_NAME, cookieOptions);
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=users-controllers.js.map