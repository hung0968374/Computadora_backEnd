const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const body = req.body;
  // res.json({ body });
  if (!userId) {
    res.status(403).json({ success: false, message: "Yêu cầu không hợp lệ" });
  }
  try {
    const newComment = new Comment({
      user: body.userInfo,
      commentContent: body.comment,
      postId: body.postId,
    });
    // console.log(newComment);
    await newComment.save();
    res.json({ success: true, newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({}).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
router.get("/postId/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
router.get("/filter", async (req, res) => {
  const postId = req.query.postId;
  const page = req.query.page;
  const limit = 5;
  try {
    const slicedComments = await Comment.find({ postId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        createdAt: -1,
      });
    res.json({ success: true, slicedComments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});
module.exports = router;
