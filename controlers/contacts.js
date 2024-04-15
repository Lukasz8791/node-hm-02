const Contact = require("../models/Contact");

// pobranie
const getAllContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error("Error getting contacts from database");
  }
};

// nowy
const addContact = async (contactData) => {
  try {
    return await Contact.create(contactData);
  } catch (error) {
    throw new Error("Error adding contact to database");
  }
};

// Aktualizacja
const updateContact = async (contactId, newData) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, newData, { new: true });
  } catch (error) {
    throw new Error("Error updating contact in database");
  }
};

// Usuwanie
const deleteContact = async (contactId) => {
  try {
    return await Contact.findByIdAndDelete(contactId);
  } catch (error) {
    throw new Error("Error deleting contact from database");
  }
};

module.exports = { getAllContacts, addContact, updateContact, deleteContact };
