import express from "express";
const router = express.Router();

router.delete("/refresh-token", (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "refresh token deleted" });
  } catch (error) {}
});

export default router;
