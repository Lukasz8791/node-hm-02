const express = require("express");
const connectDB = require("./db");
const sharp = require("sharp");
const {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
} = require("./controlers/contacts");
const multer = require("multer");
const gravatar = require("gravatar");
const fs = require("fs");

const app = express();

connectDB();

app.use(express.json());
app.use(express.static("public"));

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

const upload = multer({ dest: "tmp/" });
app.patch("/api/users/avatars", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const resizedBuffer = await sharp(buffer)
      .resize({ width: 250, height: 250 })
      .toBuffer();

    const avatarName = `${req.user._id.toString()}.jpg`;
    const avatarPath = `public/avatars/${avatarName}`;
    fs.writeFileSync(avatarPath, resizedBuffer);

    req.user.avatarURL = `/avatars/${avatarName}`;
    await req.user.save();

    res.status(200).json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
