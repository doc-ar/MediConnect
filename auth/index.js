import express, { json } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { neon } from "@neondatabase/serverless";
import { jwtTokens } from "./utils/jwt-helpers.js";
import { authenticateToken } from "./utils/authorization.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const sql = neon(process.env.DATABASE_URL);
const app = express();
const PORT = process.env.AUTH_PORT || 3000;
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.get("/auth/validate", authenticateToken, async (req, res) => {
  return res.status(200).json({ message: "Validation Successful" });
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
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.delete("/auth/refresh-token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {}
});

app.post("/auth/signup", async (req, res) => {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${req.body.email}
    `;

    // Email Check
    if (users.length > 0)
      return res.status(403).json({ error: "The user already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await sql`INSERT INTO users (email,password, role)
      VALUES (${req.body.email}, ${hashedPassword}, ${req.body.role}) 
      RETURNING *`;
    return res.json({ users: newUser[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    var hasPatientProfile = false;
    var hasDoctorProfile = false;
    var tokens = null;
    const users = await sql`
      SELECT * FROM users WHERE email = ${req.body.email}
    `;

    // Email Check
    if (users.length === 0)
      return res.status(401).json({ error: "Email does not exist" });
    // Password Check
    const validPassword = await bcrypt.compare(
      req.body.password,
      users[0].password,
    );
    if (!validPassword)
      return res.status(401).json({ error: "Password is incorrect" });

    tokens = jwtTokens(users[0]);

    const [doctor, patient] = await Promise.all([
      sql`SELECT u.user_id, d.doctor_id, u.email, u.role FROM doctors d
      JOIN users u ON u.user_id = d.user_id
      WHERE u.user_id = ${users[0].user_id}`,
      sql`SELECT u.user_id, p.patient_id, u.email, u.role FROM patients p
      JOIN users u ON u.user_id = p.user_id
      WHERE u.user_id = ${users[0].user_id}`,
    ]);

    // Check if Doctor
    if (doctor.length > 0) {
      hasDoctorProfile = true;
    }

    // Check if Patient
    if (patient.length > 0) {
      hasPatientProfile = true;
    }

    tokens.hasPatientProfile = hasPatientProfile;
    tokens.hasDoctorProfile = hasDoctorProfile;
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    return res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service is running on ${PORT}`);
});
