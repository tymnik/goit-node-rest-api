import express from "express";
import {
  getAllContactsWrapped,
  getContactByIdWrapped,
  deleteContactWrapped,
  createContactWrapped,
  updateContactWrapped,
  updateFavoriteWrapped,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";
import authenticate from "../helpers/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContactsWrapped);
contactsRouter.get("/:id", authenticate, isValidId, getContactByIdWrapped);
contactsRouter.delete("/:id", authenticate, isValidId, deleteContactWrapped);
contactsRouter.post(
  "/", authenticate,
  validateBody(createContactSchema),
  createContactWrapped
);
contactsRouter.put(
  "/:id", authenticate,
  validateBody(updateContactSchema),
  isValidId,
  updateContactWrapped
);

contactsRouter.patch(
  "/:id/favorite", authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavoriteWrapped
);

export default contactsRouter;
