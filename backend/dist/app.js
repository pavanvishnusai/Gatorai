// import express from "express";
// import { config } from "dotenv";
// import morgan from "morgan";
// import appRouter from "./routes/index.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// config();
// const app = express();
// const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "https://gatorai-1.onrender.com"]; 
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(morgan("dev"));
// app.use("/api/v1", appRouter);
// export default app;
import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();
// ✅ Trust Render proxy (needed for secure cookies via HTTPS)
app.set("trust proxy", 1);
// ✅ Define allowed origins (frontend deployed + local dev)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://gatorai-1.onrender.com", // your Render frontend URL
    "https://gatorai.onrender.com" // optional: backend domain (for internal testing)
];
// ✅ CORS setup for cookies & HTTPS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // ✅ allow browser to send cookies
}));
// ✅ Body + Cookie + Logger middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
// ✅ Routes
app.use("/api/v1", appRouter);
// ✅ Default route (optional sanity check)
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server running successfully ✅" });
});
export default app;
//# sourceMappingURL=app.js.map