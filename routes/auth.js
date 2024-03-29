import express from "express";
import authenticate from "../helpers/authenticate.js";
import validateBody from "../helpers/validateBody.js";
import upload from "../helpers/upload.js";
import {
  registerWrapped,
  verifyEmailWrapped,
  resendVerifyEmailWrapped,
  loginWrapped,
  getCurrentWrapped,
  logoutWrapped,
  updateSubscriptionWrapped,
  updateAvatarWrapped,
} from "../controllers/authControllers.js";
import {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerWrapped);

authRouter.get("/verify/:verificationToken", verifyEmailWrapped);

authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmailWrapped);

authRouter.post("/login", validateBody(loginSchema), loginWrapped);

authRouter.get("/current", authenticate, getCurrentWrapped);

authRouter.post("/logout", authenticate, logoutWrapped);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscriptionWrapped
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatarWrapped
);

export default authRouter;
