import Joi from "joi";
import { emailRegex, passRegex } from "../models/user.js";

export const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().pattern(passRegex).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passRegex).required(),
});