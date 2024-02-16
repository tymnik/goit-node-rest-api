import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import jimp from "jimp";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendMail from "../helpers/sendEmail.js";
import { HttpError } from "../helpers/HttpError.js";

const { SECRET_KEY, BASE_URL } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, subscription, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendMail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, { message: "Email not found" });
  }
  if (user.verify) {
    throw HttpError(400, { message: "Verification has already been passed" });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendMail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(404, "User not found");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const allowedSubscriptions = ["starter", "pro", "business"];
  if (!allowedSubscriptions.includes(subscription)) {
    throw HttpError(400, "Invalid subscription value");
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription: subscription },
    { new: true }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  res.json(updatedUser);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) throw HttpError(400, "File is required");
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const avatar = await jimp.read(tempUpload);
  avatar.cover(250, 250).write(resultUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export const registerWrapped = ctrlWrapper(register);
export const verifyEmailWrapped = ctrlWrapper(verifyEmail);
export const resendVerifyEmailWrapped = ctrlWrapper(resendVerifyEmail);
export const loginWrapped = ctrlWrapper(login);
export const getCurrentWrapped = ctrlWrapper(getCurrent);
export const logoutWrapped = ctrlWrapper(logout);
export const updateSubscriptionWrapped = ctrlWrapper(updateSubscription);
export const updateAvatarWrapped = ctrlWrapper(updateAvatar);
