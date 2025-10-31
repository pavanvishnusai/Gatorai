import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import { OpenAI } from 'openai';
import mongoose from "mongoose";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {},
});
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // const openai = new OpenAI({
        //     apiKey: process.env.OPENAI_API_KEY,
        //     // organization: process.env.OPENAI_ORG_ID,
        // });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(completion.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUsers = async (req, res, next) => {
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
        return res.status(200).json({ message: "ok", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
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
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "ok" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chats-controllers.js.map