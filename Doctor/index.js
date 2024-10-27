import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import { authMiddleware } from "./utils/authorization.js";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(json());

app.get("/doctors", authMiddleware, (req, res) => {
  try {
  const users = await sql`SELECT * FROM users`
  res.json({users: users})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

app.get("/doctors/:id", (req, res) => {
  const doctor = doctors.find((u) => u.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).send("doctor does not exist");
  res.send(doctor);
});

app.listen(PORT, () => {
  console.log(`Doctor Backend Service is running on ${PORT}`);
});
