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

// ✅ Allow Render’s HTTPS proxy for secure cookies
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://gatorai-1.onrender.com", // Frontend on Render
  "http://localhost:5173",           // Local dev
];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // ✅ allow sending cookies
//   })
// );
app.use(
  cors({
    origin: ["https://gatorai-1.onrender.com", "http://localhost:5173"], // both allowed
    credentials: true, // ✅ allow sending/receiving cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware setup
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/v1", appRouter);

export default app;
