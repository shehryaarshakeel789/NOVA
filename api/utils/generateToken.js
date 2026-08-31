import "dotenv/config";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
const security = process.env.NODE_ENV === "production";
export const generateToken = function (payload, res, time = "7d") {
  const token = jwt.sign(payload, secret, { expiresIn: time });
  res.cookie("token", token, {
    httpOnly: true,
    secure: security,
    sameSite: "lax",
    maxAge: 604800000,
  });
};
