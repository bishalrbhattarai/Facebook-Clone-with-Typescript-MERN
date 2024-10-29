import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { z } from "zod";
import fs from "fs";
import { cloudinary } from "./middleware/cloudinary";

dotenv.config();
const PORT = process.env.PORT;
import connection from "./db/connection";
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import userRoutes from "./routes/user.route";

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).send(errors);
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Running on port ${PORT}`);
  connection();
});
