import User from "../models/User.js";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
export const isAuth = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthenticated request" });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated request" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "requesting from Unauthenticated user" });
  }
};
