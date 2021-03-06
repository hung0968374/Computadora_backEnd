const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => res.send("User route"));
router.post("/register/verifyAccount", async (req, res) => {
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const { username, password, email } = req.body;
  const isValidEmail = validateEmail(email);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  /////validate user input
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên đăng nhập hoặc mật khẩu" });
  } else if (!isValidEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email không hợp lệ" });
  }
  if (username.length > 50 || password.length > 50) {
    return res
      .status(400)
      .json({ message: "Tên hoặc mật khẩu tối đa giới hạn ở 50 kí tự" });
  }
  // validate user existence
  try {
    // check for existing user
    const usernameExisted = await User.findOne({ username });
    // check whether email existed or not
    const userEmailExisted = await User.findOne({ email });
    if (userEmailExisted || usernameExisted) {
      return res.status(400).json({
        success: false,
        message: "Email và (hoặc) tên đăng nhập đã tồn tại",
      });
    }
    const accessToken = jwt.sign(
      { username, hashedPassword, email },
      process.env.ACCESS_TOKEN_SECRET
    );
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    var mailOptions = {
      from: "ecommerceApp@gmail.com",
      to: email,
      subject: "Click vào link này để kích hoạt tài khoản của bạn",
      html: `<a href="https://computadora.netlify.app/activateAccount/${accessToken}">Bấm để kích hoạt tài khoản bạn đã đăng kí.</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message:
            "Chúng tôi đã gửi đường link xác thực đăng kí tài khoản vào gmail của bạn (xem mục thư rác), hãy bấm vào đường link đó để kích hoạt tài khoản bạn đã đăng kí.",
          accessToken,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

router.post("/register/activateAccount", async (req, res) => {
  try {
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decodedToken.username;
    const email = decodedToken.email;
    /////recheck
    const usernameExisted = await User.findOne({ username });
    const userEmailExisted = await User.findOne({ email });
    if (!usernameExisted && !userEmailExisted) {
      const newUser = new User({
        username: decodedToken.username,
        email: decodedToken.email,
        password: decodedToken.hashedPassword,
        name: decodedToken.username,
      });
      await newUser.save();
      res.json({ user: newUser });
    } else {
      res.status(400).json({ message: "Email hoặc tên đăng nhập đã tồn tại" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // validate user existence
  if (username.length > 50 || password.length > 50) {
    return res
      .status(400)
      .json({ message: "Tên hoặc mật khẩu tối đa giới hạn ở 50 kí tự" });
  }
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên đăng nhập hoặc mật khẩu" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập không tồn tại" });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không đúng" });
    }
    /// user validated -> return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10000h" }
    );
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
