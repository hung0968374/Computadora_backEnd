const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");
const { cloudinary } = require("../utils/cloudary");

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

module.exports = router;
