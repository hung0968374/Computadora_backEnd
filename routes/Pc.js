const express = require("express");
const router = express.Router();
const Pc = require("../models/Pc");
// @route POST api/pcs
// @desciption Create post
// @access Private
router.post("/darkKnight", async (req, res) => {
  console.log(req.body);
  const {
    imgs,
    title,
    processor,
    ram,
    graphicCard,
    operatingSystem,
    price,
    ssd,
    review,
    genre,
  } = req.body;
  if (
    !imgs ||
    !title ||
    !processor ||
    !ram ||
    !graphicCard ||
    !operatingSystem ||
    !price ||
    !ssd ||
    !review
  ) {
    return res.status(400).json({ message: "failed" });
  }
  try {
    const newPc = new Pc({
      imgs,
      title,
      processor,
      ram,
      graphicCard,
      operatingSystem,
      price,
      review,
      ssd,
      genre,
    });
    await newPc.save();
    res.json({ success: true, pc: newPc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

//// get api/posts
router.get("/", async (req, res) => {
  try {
    const pcs = await Pc.find({});
    res.json({ success: true, pcs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/search/searchItemsPool", async (req, res) => {
  try {
    const searchResultsPool = await Pc.find(
      {},
      { title: 1, imgs: 1, price: 1, genre: 1 }
    );
    res.json({ success: true, searchResultsPool });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const pc = await Pc.findOne({ _id: id });
    res.json(pc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
