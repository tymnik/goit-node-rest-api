import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await contactsService.listContacts(
    { owner },
    "-createdAt -updatedAt",
    { skip, limit }
  );
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (contact) {
    res.json(contact);
  } else {
    throw HttpError(404, "Not Found");
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await contactsService.removeContact(id);

  if (deletedContact) {
    res.json(deletedContact);
  } else {
    throw HttpError(404, "Not Found");
  }
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await contactsService.updateContactById(id, req.body);

  if (!updatedContact) {
    throw HttpError(404, "Not Found");
  }
  res.json(updatedContact);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await contactsService.updateStatusContact(
    id,
    req.body
  );

  if (!updatedContact) {
    throw HttpError(404, "Not Found");
  }
  res.json(updatedContact);
};

export const getAllContactsWrapped = ctrlWrapper(getAllContacts);
export const getContactByIdWrapped = ctrlWrapper(getContactById);
export const deleteContactWrapped = ctrlWrapper(deleteContact);
export const createContactWrapped = ctrlWrapper(createContact);
export const updateContactWrapped = ctrlWrapper(updateContact);
export const updateFavoriteWrapped = ctrlWrapper(updateFavorite);
