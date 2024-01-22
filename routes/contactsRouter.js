import express from "express";
import {
  getAllContactsWrapped,
  getContactByIdWrapped,
  deleteContactWrapped,
  createContactWrapped,
  updateContactWrapped,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContactsWrapped);
contactsRouter.get("/:id", getContactByIdWrapped);
contactsRouter.delete("/:id", deleteContactWrapped);
contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  createContactWrapped
);
contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  updateContactWrapped
);

export default contactsRouter;
