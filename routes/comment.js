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

router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  const commentNeedDeleting = req.body;
  if (!userId) {
    res.status(403).json({ success: false, message: "Yêu cầu không hợp lệ" });
  }
  // console.log("cmt", commentNeedDeleting);
  // console.log("userid", userId);
  if (
    userId === commentNeedDeleting.user.facebookUserId ||
    userId === commentNeedDeleting.user.googleId ||
    userId === commentNeedDeleting.user._id ||
    userId === commentNeedDeleting.user.id
  ) {
    try {
      const deleteComment = await Comment.findOneAndDelete({
        _id: commentNeedDeleting._id,
      });
      if (!deleteComment) {
        res.status(401).json({ message: "Yêu cầu không hợp lệ" });
      }
      res.json({ success: true, comment: deleteComment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
  } else {
    res.status(401).json({ message: "not authorized" });
  }
});
module.exports = router;
