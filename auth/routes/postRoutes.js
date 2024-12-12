import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateResetToken, jwtTokens } from "../utils/jwt-helpers.js";
import { neon } from "@neondatabase/serverless";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
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

router.post("/login", async (req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
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

router.post("/change-password", async (req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    // Fetch user from database
    const sql = neon(process.env.DATABASE_URL);
    const user = await sql`
      SELECT * FROM users WHERE email = ${req.body.email}
    `;

    // Email Check
    if (user.length === 0)
      return res.status(401).json({ error: "Email does not exist" });

    // Generate Reset Token
    const user_id = user[0].user_id;
    const resetToken = generateResetToken(user_id);
    const resetLink = `https://mediconnect.live/auth/reset-password?token=${resetToken}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Outlook)
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email Options
    const mailOptions = {
      from: "noreply.mediconnect@ygmail.com",
      to: req.body.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in ${process.env.RESET_TOKEN_EXPIRE}.</p>
      `,
    };

    // Send the Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    // Verify the token
    let payload;
    try {
      payload = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Extract user information (e.g., user_id)
    const { user_id } = payload;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE user_id = ${user_id}
    `;

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
