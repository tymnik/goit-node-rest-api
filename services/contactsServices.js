import { nanoid } from "nanoid";
import Contact from "../models/contact.js";

async function listContacts() {
  const contacts = await Contact.find();
  return contacts;
}

async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact || null;
}

async function removeContact(id) {
  const removedContact = await Contact.findByIdAndDelete(id);
  return removedContact || null;
}

async function addContact(data) {
  const newContact = await Contact.create({
    id: nanoid(),
    ...data,
  });

  return newContact;
}

async function updateContactById(id, data) {
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  return updatedContact || null;
}

async function updateStatusContact(id, data) {
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  return updatedContact || null;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContact,
};
