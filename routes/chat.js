const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

router.post("/", async (req, res) => {
  const { message, name, received } = req.body;
  try {
    const newChat = new Chat({
      message,
      name,
      received,
    });
    await newChat.save();
    res.json({ sucess: true, chat: newChat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
