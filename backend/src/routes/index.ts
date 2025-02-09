import {Router} from "express";
import userRouter from "./user-routes.js";
import chatsRoutes from "./chats-routes.js";

const appRouter = Router();

appRouter.use("/user", userRouter);
appRouter.use("/chat", chatsRoutes);

export default appRouter;