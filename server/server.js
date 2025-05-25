import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routers/auth.route.js";
import userRouter from "./routers/user.route.js";
import connectDB from "./configs/db.config.js";
import cookieParser from "cookie-parser";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
  res.json({ success: true, message: "server is working!" });
});

app.listen(PORT, () =>
  console.log(`Server is running on\nhttp://localhost:${PORT}`)
);
