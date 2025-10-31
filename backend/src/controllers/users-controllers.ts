import { compare, hash } from "bcryptjs";
import User from "../models/User.js";
import { NextFunction, Request, Response } from "express";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import mongoose from "mongoose";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

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

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            path: "/",
            signed: true,
            domain: "localhost",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(201).json({ message: "ok", name });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

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

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            path: "/",
            signed: true,
            domain: "localhost",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });

        return res.status(200).json({ message: "ok", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

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
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

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

         res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            path: "/",
            signed: true,
            domain: "localhost",
        });

        return res.status(200).json({ message: "ok", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
