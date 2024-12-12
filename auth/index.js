// Setup Dotenv first
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.AUTH_PORT || 3000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
const app = express();
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

// Import Routes
import getRoutes from "./routes/getRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";

// Use Routes
app.use("/auth", getRoutes);
app.use("/auth", postRoutes);
app.use("/auth", deleteRoutes);

app.listen(PORT, () => {
  console.log(`Auth service is running on ${PORT}`);
});
