import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

dotenv.config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({ email: newUser.email });
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

  const payload = { id: user._id};

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  res.json({ token });

  // try {
  //   const { id } = jwt.verify(token, SECRET_KEY);
  // } catch (error) {
  //   console.log(error.message);
  // }
};

export const registerWrapped = ctrlWrapper(register);
export const loginWrapped = ctrlWrapper(login);
