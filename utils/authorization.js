async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Null Token" });

  try {
    const response = await fetch("http://127.0.0.1:3000/auth/validate", {
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

function currentDate() {
  const date = new Date();

  // Extract parts of the date
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" }); // Abbreviated month name
  const day = String(date.getDate()).padStart(2, "0"); // Ensures 2-digit day

  // Format as 'YYYY-Mon-DD'
  return `${year}-${month}-${day}`;
}

export { authMiddleware, currentDate };
