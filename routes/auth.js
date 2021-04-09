const express = require("express");
const router = express.Router();
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
// @route Post api/auth/register
// @access public

router.get("/", (req, res) => res.send("User route"));
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // validate user existence
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });
  }
  try {
    // check for existing user
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "username existed, choose another one",
      });
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    /// return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "userCreated successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
// @route Post api/auth/login
// @access public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // validate user existence
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "missing username or password" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "username doesnt exist" });
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "password is incorrect" });
    }
    /// user validated -> return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
module.exports = router;
