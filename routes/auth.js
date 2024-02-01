import express from "express";
import validateBody from "../helpers/validateBody.js";
import {registerWrapped} from "../controllers/authControllers.js"
import {registerSchema, loginSchema} from '../schemas/usersSchemas.js'

const authRouter = express.Router();

authRouter.post("/users/register", validateBody(registerSchema), registerWrapped);

export default authRouter;