async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Null Token" });

  try {
    const response = await fetch("127.0.0.1:3000/auth/validate", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // Handle errors from the auth service
    return res
      .status(401)
      .json({
        error: error.response?.data?.error || "Token validation failed",
      });
  }
}
