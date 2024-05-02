const express = require("express");
const connectDB = require("./db");
const {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
} = require("./controlers/contacts");

const app = express();

connectDB();

app.use(express.json());

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/contacts", async (req, res) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/api/contacts/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/contacts/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await deleteContact(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
