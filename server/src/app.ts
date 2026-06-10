import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

import { auth } from "./lib/auth.js";

dotenv.config();

const app = express();

// CORS configuration - CRITICAL for OAuth
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// Better Auth handler - MUST be before other routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route to confirm the server is working
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "online",
    message: "🚀 TypeScript Express server is running perfectly!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = Number(process.env.PORT) || 3000;

// Start the server
app.listen(PORT, () => {
  console.log("=======================================================");
  console.log(`Server is running on: http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Backend URL: ${process.env.BACKEND_URL}`);
  console.log(`Better Auth URL: ${process.env.BETTER_AUTH_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log("=======================================================");
});
