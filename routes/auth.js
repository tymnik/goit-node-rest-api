import express from "express";
import authenticate from "../helpers/authenticate.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerWrapped,
  loginWrapped,
  getCurrentWrapped,
  logoutWrapped,
  updateSubscriptionWrapped,
} from "../controllers/authControllers.js";
import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerWrapped);

authRouter.post("/login", validateBody(loginSchema), loginWrapped);

authRouter.get("/current", authenticate, getCurrentWrapped);

authRouter.post("/logout", authenticate, logoutWrapped);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscriptionWrapped
);

export default authRouter;
