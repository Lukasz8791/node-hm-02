const Contact = require("../models/Contact");

const getAllContacts = async (userId) => {
  try {
    return await Contact.find({ owner: userId });
  } catch (error) {
    throw new Error("Error getting contacts from database");
  }
};

const addContact = async (contactData) => {
  try {
    return await Contact.create(contactData);
  } catch (error) {
    throw new Error("Error adding contact to database");
  }
};

const updateContact = async (contactId, newData) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, newData, { new: true });
  } catch (error) {
    throw new Error("Error updating contact in database");
  }
};

const deleteContact = async (contactId) => {
  try {
    return await Contact.findByIdAndDelete(contactId);
  } catch (error) {
    throw new Error("Error deleting contact from database");
  }
};

module.exports = { getAllContacts, addContact, updateContact, deleteContact };
