import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const userSchema = new Schema({
  password: {
    type: String,
    match: passRegex,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    match: emailRegex,
    required: [true, "Email is required"],
    unique: true,
  },
});

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

export default User;