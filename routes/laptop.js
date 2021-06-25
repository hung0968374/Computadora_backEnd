const express = require("express");
const router = express.Router();
const Laptop = require("../models/Laptop");
const upload = require("../middleware/uploadFileUsingMulter");
const storeFileToLocalDisk = require("../middleware/convertImgUrlToLocalImg");

router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find({}).sort({ createdAt: -1 });
    res.json({ success: true, laptops });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

router.post("/singleFile", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("single file uploaded");
});

router.post("/mulFile", upload.array("images", 10), async (req, res) => {
  const files = req.files;
  console.log(files);
  const {
    title,
    processor,
    screen,
    ram,
    graphicCard,
    pin,
    weight,
    operatingSystem,
    price,
  } = req.body;
  const productImgs = [];
  files.map((file) => {
    productImgs.push(file.filename);
  });
  try {
    const newLaptop = new Laptop({
      imgs: productImgs,
      title,
      processor,
      screen,
      ram,
      graphicCard,
      pin: pin,
      weight,
      operatingSystem,
      price,
      genre: "laptop",
    });
    await newLaptop.save();
    res.json({ success: true, newLaptop });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

router.post(
  "/pushCrawledDataToDatabase",
  storeFileToLocalDisk,
  async (req, res) => {
    console.log("req urls from middleware", req.imgsUrl);
    const imgs = req.imgsUrl;
    const {
      title,
      processor,
      screen,
      ram,
      graphicCard,
      pin,
      weight,
      operatingSystem,
      price,
      review,
      genre,
    } = req.body;
    if (!imgs || !title) {
      res
        .status(400)
        .json({ status: "failed", message: "Title va anh khong duoc trong" });
    }
    try {
      const newLaptop = new Laptop({
        imgs,
        title,
        processor,
        screen,
        ram,
        graphicCard,
        pin,
        weight,
        operatingSystem,
        price,
        review,
        genre,
      });
      await newLaptop.save();
      res.json({ status: "successful", newLaptop });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "server error" });
    }
  }
);

module.exports = router;
