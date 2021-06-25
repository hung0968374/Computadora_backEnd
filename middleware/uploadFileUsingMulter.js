const multer = require("multer");

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

module.exports = upload;
