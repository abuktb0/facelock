import jwt from "jsonwebtoken";

export const otpGenerator = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};
export const tokenGenerator = ({ res, id }) => {
  const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};