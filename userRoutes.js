const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const FormData = require("form-data");

const sendEmail = async (to, subject, text) => {
  const formData = new FormData();
  formData.append("from", "Your Name doktor8on@gmail.com");
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("text", text);

  try {
    const response = await axios.post(
      "https://api.mailgun.net/v3/sandbox606a19c5d1c3474da6f21dc2268cf2ed.mailgun.org/messages",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Basic ${Buffer.from(
            `api:${process.env.MAILGUN_API_KEY}`
          ).toString("base64")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error sending email");
  }
};

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

      const verificationToken = uuidv4();

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        password: hashedPassword,
        verificationToken: verificationToken,
      });

      await user.save();

      const verificationText = `Click the following link to verify your email: ${process.env.APP_URL}/verify/${verificationToken}`;
      await sendEmail(email, "Verify your email", verificationText);

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

    const verificationToken = uuidv4();

    user = new User({
      email,
      password,
      avatarURL,
      verificationToken: verificationToken,
    });

    await user.save();

    const verificationText = `Click the following link to verify your email: https://yourwebsite.com/verify/${verificationToken}`;
    await sendEmail(email, "Verify your email", verificationText);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
