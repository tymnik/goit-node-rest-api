import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json(HttpError(404, "Not found"));
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await contactsService.removeContact(id);

  if (deletedContact) {
    res.json(deletedContact);
  } else {
    res.status(404).json(HttpError(404, "Not found"));
  }
};

export const createContact = async (req, res) => {
  const { body } = req;
  const newContact = await contactsService.addContact(body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const existingContact = await contactsService.getContactById(id);

  if (!existingContact) {
    throw new HttpError(404, "Not found");
  }

  const updatedContact = await contactsService.updateContact(id, body);
  res.json(updatedContact);
};

export const getAllContactsWrapped = ctrlWrapper(getAllContacts);
export const getContactByIdWrapped = ctrlWrapper(getContactById);
export const deleteContactWrapped = ctrlWrapper(deleteContact);
export const createContactWrapped = ctrlWrapper(createContact);
export const updateContactWrapped = ctrlWrapper(updateContact);
