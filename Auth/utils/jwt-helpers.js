import jwt from "jsonwebtoken";

function jwtTokens({ user_id, email, role }) {
  const user = { user_id, email, role };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

  return { accessToken, refreshToken };
}

export { jwtTokens };
