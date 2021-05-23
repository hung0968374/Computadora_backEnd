const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// disable post function

// router.post("/darkKnight", async (req, res) => {
//   const { blogTitle, blogMainImg, blogBody } = req.body;
//   if (!blogTitle || !blogMainImg || !blogBody) {
//     return res.status(400).json({ message: "failed" });
//   }
//   try {
//     const newBlog = new Blog({
//       blogTitle,
//       blogMainImg,
//       blogBody,
//     });
//     await newBlog.save();
//     res.json({ success: true, newBlog });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "server error" });
//   }
// });

//// get api/posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/random/ramdomBlog", async (req, res) => {
  const rand = Math.floor(Math.random() * 57);
  try {
    const blog = await Blog.findOne({}).skip(rand);
    res.json({ success: true, blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/random/getSevenDistinctRandomBlog", async (req, res) => {
  try {
    let sevenRamdomBlog = [];
    let selectedIndex = [];
    for (var i = 0; i < 7; i++) {
      let indexChoosed = false;
      while (!indexChoosed) {
        const rand = Math.floor(Math.random() * 57);
        if (!selectedIndex.includes(rand)) {
          selectedIndex.push(rand);
          const blog = await Blog.findOne(
            {},
            { blogTitle: 1, blogMainImg: 1, blogBody: 1, createdAt: 1 }
          ).skip(rand);
          sevenRamdomBlog.push(blog);
          indexChoosed = true;
        }
      }
    }
    res.json({ success: true, sevenRamdomBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/filter", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.amountPerPage;
  try {
    const blogs = await Blog.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/search/searchItemsPool", async (req, res) => {
  try {
    const searchResultsPool = await Blog.find(
      {},
      { blogTitle: 1, blogMainImg: 1, createdAt: 1 }
    ).sort({ createdAt: -1 });
    res.json({ success: true, searchResultsPool });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.findOne({ _id: id });
    res.json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
