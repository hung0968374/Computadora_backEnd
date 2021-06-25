const express = require("express");
const router = express.Router();
const Laptop = require("../models/Laptop");
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const fs = require("fs");
const fetch = require("node-fetch");

//////////middleware

const fileStorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

//////////middleware

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

router.post("/convertUrlToLocalImg", async (req, res) => {
  const url =
    "https://lumen.thinkpro.vn//backend/uploads/product/color_images/2021/6/16/xps9700-1.jpg";
  const response = await fetch(url);
  const splitedUrl = url.split("/");
  console.log(splitedUrl[splitedUrl.length - 1]);
  const processedUrl = `${Date.now()}-${splitedUrl[splitedUrl.length - 1]}`;
  const buffer = await response.buffer();
  fs.writeFile(`./images/${processedUrl}`, buffer, () => {
    console.log(`./images/${processedUrl}`);
  });
  res.json("successful");
});

module.exports = router;
