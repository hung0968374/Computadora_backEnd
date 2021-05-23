const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");
const History = require("../models/History");
const { cloudinary } = require("../utils/cloudary");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

router.put("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({ message: "Yêu cầu không hợp lệ" });
  }
  const newUserInfo = req.body;
  // console.log("new user info", newUserInfo);
  const fileStr = newUserInfo.imageUrl;
  if (fileStr) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "computadora",
      });
      // console.log(uploadedResponse);
      newUserInfo.imageUrl = uploadedResponse.secure_url;
    } catch (error) {
      console.error();
      res.status(500).json({ message: "something went wrong" });
    }
  }
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      newUserInfo,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res
        .status(401)
        .json({ success: false, message: "Update user thất bại" });
    }
    return res.json({ success: true, newUserInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/changePw", verifyToken, async (req, res) => {
  const userId = req.userId;
  const body = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    if (!userId || !user) {
      return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
    }
    const passwordValid = await bcrypt.compare(
      body.currentPassword,
      user.password
    );
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại của bạn không đúng",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashingNewPassword = await bcrypt.hash(body.newPassword, salt);
    // console.log(hashingNewPassword);
    const updatedUser = user;
    updatedUser.password = hashingNewPassword;
    // console.log(updatedUser);
    const updatedUserInfo = await User.findOneAndUpdate(
      { _id: userId },
      updatedUser,
      {
        new: true,
      }
    );
    res.json({ userId, body, user: updatedUserInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
router.post("/recoverPw", async (req, res) => {
  const body = req.body;
  try {
    const user = await User.findOne({ email: body.email });
    if (!user || user.username !== body.username) {
      return res.status(400).json({
        message: "Không có tài khoản nào khớp với thông tin bạn cung cấp.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(body.newPassword, salt);
    const userEmail = user.email;
    const token = jwt.sign(
      { userEmail, hashedNewPassword },
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
      to: userEmail,
      subject: "Click vào link này để lấy lại tài khoản của bạn",
      html: `<a href="https://computadora.netlify.app/activateRecoveringPw/${token}">CLICK TO RECOVER YOUR ACCOUNT</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message:
            "Chúng tôi đã gửi đường link xác thực lấy lại tài khoản vào gmail của bạn (check mục thư rác), hãy bấm vào đường link đó để lấy lại tài khoản bạn đã đăng kí.",
          token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/activateRecoveringPw", async (req, res) => {
  const token = req.body.token;
  try {
    const tokenAlreadyExist = await History.findOne({ token });
    // console.log("token existed", tokenAlreadyExist);
    if (tokenAlreadyExist) {
      return res
        .status(400)
        .json({ message: "Token lấy lại tài khoản này đã được sử dụng" });
    } else {
      const newHistoryElement = new History({
        token: token,
      });
      await newHistoryElement.save();
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userEmail = decodedToken.userEmail;
      const userNewPw = decodedToken.hashedNewPassword;
      const userWithGivenEmail = await User.findOne({ email: userEmail });
      const updatedUser = userWithGivenEmail;
      // console.log(updatedUser);
      updatedUser.password = userNewPw;
      const currentUserInfo = await User.findOneAndUpdate(
        { email: userEmail },
        updatedUser,
        { new: true }
      );

      res.json({ success: true, currentUserInfo });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
module.exports = router;
