// Filename - index.js

import express, { json } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { jwtTokens } from "./utils/jwt-helpers.js";
import { authenticateToken } from "./utils/authorization.js";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

//app.use("/auth", express.static(join(__dirname, "src")));
app.get("/auth", authenticateToken, async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users;`;
    res.json({ users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/auth/validate", authenticateToken, async (req, res) => {
  return res.status(200);
});

app.get("/auth/refresh-token", (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token || req.body.refresh_token;
    if (refreshToken === null)
      return res.status(401).json({ error: "Null refresh token" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.status(403).json({ error: error.message });
        let tokens = jwtTokens(user);
        res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
        res.json(tokens);
      },
    );
  } catch (error) {}
});

app.delete("/auth/refresh-token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {}
});

app.post("/auth/pass", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await sql`INSERT INTO users (email,password, role)
      VALUES (${req.body.email}, ${hashedPassword}, ${req.body.role}) 
      RETURNING *`;
    res.json({ users: newUser[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;

    // Email Check
    if (users.length === 0)
      return res.status(401).json({ error: "Email is incorrect" });

    // Password Check
    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword)
      return res.status(401).json({ error: "Password is incorrect" });

    let tokens = jwtTokens(users[0]);
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service is running on ${PORT}`);
});
