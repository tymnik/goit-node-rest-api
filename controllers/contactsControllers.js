import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
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
  const { body } = req;
  const newContact = await contactsService.addContact(body);
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

export const getAllContactsWrapped = ctrlWrapper(getAllContacts);
export const getContactByIdWrapped = ctrlWrapper(getContactById);
export const deleteContactWrapped = ctrlWrapper(deleteContact);
export const createContactWrapped = ctrlWrapper(createContact);
export const updateContactWrapped = ctrlWrapper(updateContact);
