import express, { NextFunction, Request, Response } from "express";
import http from "http"; // To create the HTTP server
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { z } from "zod";

import configureSocket from "./socket"; // Import the socket file
import connection from "./db/connection";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // Create HTTP server
configureSocket(server); // Attach Socket.IO

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "*"], // Frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ msg: "UP AND RUNNING" });
});

import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import userRoutes from "./routes/user.route";

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

// Error handling
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

// Start the server
server.listen(PORT, async () => {
  console.log(`Running on port ${PORT}`);
  connection();
});
