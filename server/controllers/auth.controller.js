import bcrypt from "bcryptjs";
import { User, registerSchema, loginSchema } from "./../models/users.model.js";
import asyncHandler from "express-async-handler";
import { otpGenerator, tokenGenerator } from "../utils/authHelper.js";
import transporter from "../configs/nm.config.js";

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const { error } = registerSchema(req.body);
  if (error) {
    return res
      .status(403)
      .json({ success: false, message: error.details[0].message });
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    const isEmailTaken = user.email === email;
    return res.status(403).json({
      success: false,
      message: isEmailTaken
        ? "Email is already registered"
        : "Username is already taken",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  tokenGenerator({ res, id: newUser._id });

  return res.status(200).json({ success: true, message: "Check your email" });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema(req.body);
  if (error) {
    return res
      .status(403)
      .json({ success: false, message: error.details[0].message });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "user not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(403)
      .json({ success: false, message: "invalid password" });
  }

  tokenGenerator({res, id: user._id});
  res.status(200).json({ success: true, message: "logged in" });
});
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res
    .status(200)
    .json({ success: true, message: "logout successfully" });
});
export const isAuthenticated = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "user is Authenticated" });
});
export const sendVerifyToken = asyncHandler(async (req, res) => {
  const id = req.user;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: "user not found" });
  }
  if (user.isVerify) {
    return res
      .status(401)
      .json({ success: false, message: "account already verified" });
  }

  const otp = otpGenerator();

  const emailOption = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "FaceLock: verify your account",
    text: `you can verify your account using this code ( ${otp} )\nDONT SHARE THIS CODE WITH ANYONE`,
  };
  await transporter.sendMail(emailOption);

  user.verifyToken = otp;
  user.verifyTokenExpiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes

  user.save();

  return res.status(200).json({ success: true, message: "Check Your Email" });
});
export const verifyToken = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const id = req.user;
  const user = await User.findById(id);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "please login first" });
  }
  if (user.verifyToken !== otp || user.verifyToken === "") {
    return res.status(401).json({ success: false, message: "wrong token" });
  }
  if (user.verifyTokenExpiresAt < Date.now()) {
    return res.status(401).json({ success: false, message: "expires token" });
  }

  user.isVerify = true;
  user.verifyToken = "";
  user.verifyTokenExpiresAt = null;

  user.save();
  return res.json({ success: true, message: "Email verified successfully" });
});
export const sendResetToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "account not found" });
  }

  const otp = otpGenerator();

  user.resetToken = otp;
  user.resetTokenExpiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes

  user.save();

  const emailOption = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "FaceLock: ResetPassword token",
    text: `you can reset your password using this code ( ${otp} )\nDONT SHARE THIS CODE WITH ANYONE`,
  };
  await transporter.sendMail(emailOption);

  return res.status(200).json({ success: true, message: "Check Your Email" });
});
export const resetToken = asyncHandler(async (req, res) => {
  const {email, otp, newPassword} = req.body

  const user = await User.findOne({email})

  if(!user){
    return res.status(404).json({success: false, message: "Invalid email"})
  }
  if(user.resetToken !== otp){
        return res.status(401).json({success: false, message: "Invalid token"})
  }
  if(user.resetTokenExpiresAt < Date.now()){
        return res.status(401).json({success: false, message: "Expires token"})
  }

  const hashPassword = await bcrypt.hash(newPassword, 10)

  user.password = hashPassword
  user.resetToken = 0
  user.resetTokenExpiresAt = null

  user.save()

  return res.status(200).json({success: true, message: "password has been reset"})
});