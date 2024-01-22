import fs from "fs/promises";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = join(__dirname, "../db", "contacts.json");

async function readContactsFile() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function writeContactsFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const contacts = await readContactsFile();
  return contacts;
}

async function getContactById(id) {
  const contacts = await readContactsFile();
  return contacts.find((contact) => contact.id === id) || null;
}

async function removeContact(id) {
  const contacts = await readContactsFile();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index !== -1) {
    const [removedContact] = contacts.splice(index, 1);
    await writeContactsFile(contacts);
    return removedContact;
  }

  return null;
}

async function addContact(data) {
  const contacts = await readContactsFile();
  const newContact = {
    id: nanoid(),
    ...data,
  };

  contacts.push(newContact);
  await writeContactsFile(contacts);

  return newContact;
}

async function updateContactById(id, data) {
  const contacts = await readContactsFile();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...data };

    await writeContactsFile(contacts);

    return contacts[index];
  } else {
    return null;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
