const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const upload = multer({ dest: "tmp/" });
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const avatarURL = gravatar.url(email, { s: "200", d: "identicon" });

    user = new User({
      email,
      password,
      avatarURL,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const buffer = fs.readFileSync(req.file.path);

      const resizedBuffer = await sharp(buffer)
        .resize({ width: 250, height: 250 })
        .toBuffer();

      const avatarName = `${req.user._id.toString()}_${Date.now()}.jpg`;

      const avatarPath = `public/avatars/${avatarName}`;

      fs.writeFileSync(avatarPath, resizedBuffer);

      req.user.avatarURL = `/avatars/${avatarName}`;

      await req.user.save();

      fs.unlinkSync(req.file.path);

      res.status(200).json({ avatarURL: req.user.avatarURL });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
