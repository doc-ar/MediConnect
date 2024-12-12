import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../utils/authorization.js";
import { generateResetToken, jwtTokens } from "../utils/jwt-helpers.js";

const router = express.Router();

router.get("/validate", authenticateToken, async (req, res) => {
  return res.status(200).json({ message: "Validation Successful" });
});

router.get("/refresh-token", (req, res) => {
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

router.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset-password", "index.html"));
});

export default router;
