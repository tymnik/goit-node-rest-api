import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

const { DB_HOST, PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
    console.log("Database connection successful");
    console.log("Server is running. Use our API on port: 3001");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tempDir = path.join(__dirname, "/temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

const avatarDir = path.join(
  __dirname,
  "public",
  "avatars"
);

app.post("/api/users", upload.single("avatar"), async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.join(avatarDir, originalname)
  await fs.rename(tempUpload, resultUpload);
  const avatar = path.join("avatars", originalname);
  const newUser = {
    id: { nanoid },
    ...req.body,
    avatar
  }
  users.push(newUser);

  res.status(201).json(newUser);
});

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
