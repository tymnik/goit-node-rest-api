import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const passRegex = /^.{8,}$/;

const userSchema = new Schema(
  {
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
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    avatarURL: { type: String },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

export default User;
