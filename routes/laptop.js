const express = require("express");
const router = express.Router();
const Laptop = require("../models/Laptop");
// const multer = require("multer");

router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find({}).sort({ createdAt: -1 });
    res.json({ success: true, laptops });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// const fileStorageEngine = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: fileStorageEngine });

// router.post("/singleFile", upload.single("image"), (req, res) => {
//   console.log(req.file);
//   res.send("single file uploaded");
// });

module.exports = router;
