async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Null Token" });

  try {
    const response = await fetch("http://auth-service:3000/auth/validate", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If the response status is not ok (e.g., 401, 403), handle the error
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error });
    }

    // If token is valid, continue to the next middleware or route handler
    req.user = await response.json(); // Assuming auth service returns user data
    next();
  } catch (error) {
    // Handle network or other unexpected errors
    return res.status(500).json({ error: "Failed to validate token" });
  }
}

export { authMiddleware };
