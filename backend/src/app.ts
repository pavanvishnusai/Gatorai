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

// ✅ Trust Render proxy (important for HTTPS + cookies)
app.set("trust proxy", 1);

// ✅ Define allowed origins (Render + local)
const allowedOrigins = [
  process.env.FRONTEND_URL,            // from Render env (e.g., https://gatorai-1.onrender.com)
  "http://localhost:5173",             // local dev
  "https://gatorai-1.onrender.com",    // deployed frontend
];

// ✅ CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests without Origin (e.g., Postman/health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow cookies
  })
);

// ✅ Core middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/v1", appRouter);

// ✅ Health-check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running successfully ✅" });
});

export default app;
