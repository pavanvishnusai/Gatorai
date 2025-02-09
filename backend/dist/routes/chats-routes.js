import { Router } from "express";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
import { deleteChats, generateChatCompletion, sendChatsToUsers } from "../controllers/chats-controllers.js";
const chatsRoutes = Router();
chatsRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generateChatCompletion);
chatsRoutes.get("/all-chats", verifyToken, sendChatsToUsers);
chatsRoutes.delete("/delete", verifyToken, deleteChats);
export default chatsRoutes;
//# sourceMappingURL=chats-routes.js.map