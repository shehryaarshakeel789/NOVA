import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeEmail } from "../utils/emailTemplates.js";

export const registerUser = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const userObj = user.toObject();
    delete userObj.password;
    generateToken({ id: userObj._id }, res);
    res.json(userObj);
    sendEmail({
      to: user.email,
      subject: "Welcome to NOVA",
      html: welcomeEmail(user.name),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email and password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email and password" });
    }
    generateToken({ id: user._id }, res);
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out" });
};
