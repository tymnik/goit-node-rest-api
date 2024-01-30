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
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContactsWrapped);
contactsRouter.get("/:id", isValidId, getContactByIdWrapped);
contactsRouter.delete("/:id", isValidId, deleteContactWrapped);
contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  createContactWrapped
);
contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  isValidId,
  updateContactWrapped
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavoriteWrapped
);

export default contactsRouter;
