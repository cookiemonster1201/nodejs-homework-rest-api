const fs = require('fs/promises')
const {v4} = require("uuid");
const contactsPath = require('./contactsPath')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config();


const {DB_HOST} = process.env

mongoose.connect(DB_HOST).then(() => {
  console.log('database connect success')
}).catch(error => {
  console.log(error.message)
  process.exit(1)
})


const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  if(!result){
      return null;
  }
  return result;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(item => item.id === contactId);
  if(idx === -1){
      return null;
  }
  const newContacts = contacts.filter((_, index) => index !== idx);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  return contacts[idx];
}

const addContact = async (body) => {
  const newContact = {...body, id: v4()};
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(item => item.id === contactId);
  if(idx === -1){
      return null;
  }
  contacts[idx] = {...contacts[idx], ...body};
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
