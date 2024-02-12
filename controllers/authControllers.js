import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import jimp from "jimp";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

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

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const avatar = await jimp.read(tempUpload);
  avatar.resize(250, 250).write(resultUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export const registerWrapped = ctrlWrapper(register);
export const loginWrapped = ctrlWrapper(login);
export const getCurrentWrapped = ctrlWrapper(getCurrent);
export const logoutWrapped = ctrlWrapper(logout);
export const updateSubscriptionWrapped = ctrlWrapper(updateSubscription);
export const updateAvatarWrapped = ctrlWrapper(updateAvatar);
