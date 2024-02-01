import express from "express";
import validateBody from "../helpers/validateBody.js";
import {registerWrapped, loginWrapped} from "../controllers/authControllers.js"
import {registerSchema, loginSchema} from '../schemas/usersSchemas.js'

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerWrapped);
authRouter.post("/login", validateBody(loginSchema), loginWrapped);

export default authRouter;