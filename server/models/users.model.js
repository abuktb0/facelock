import mongoose from "mongoose";
import joi from "joi";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 40,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 14,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExpiresAt: {
      type: Date,
      default: "",
    },
    resetToken: {
      type: String,
      default: "",
    },
    resetTokenExpiresAt: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

export const registerSchema = (obj) => {
  const schema = joi.object({
    name: joi.string().min(2).max(40).required(),
    username: joi.string().min(2).max(14).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().required()
  });
  return schema.validate(obj);
};
export const loginSchema = (obj) => {
  const schema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().required()
  });
  return schema.validate(obj);
};