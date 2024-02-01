import * as userService from "../services/authServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const register = async (req, res) => {
  const { body } = req;
  const newUser = await userService.registerUser(body);
  res.json({ email: newUser.email });
};

export const registerWrapped = ctrlWrapper(register);
