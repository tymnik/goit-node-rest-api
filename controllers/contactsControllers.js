import * as contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await contactsService.getContactById(id);

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await contactsService.removeContact(id);

    if (deletedContact) {
      res.json(deletedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createContact = async (req, res) => {
  const { body } = req;

  try {
    const { error } = createContactSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await contactsService.addContact(body);

    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const { error } = updateContactSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!Object.keys(body).length) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const existingContact = await contactsService.getContactById(id);

    if (!existingContact) {
      return res.status(404).json({ message: "Not found" });
    }

    const updatedContact = await contactsService.updateContact(id, body);

    res.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).send("Internal Server Error");
  }
};
