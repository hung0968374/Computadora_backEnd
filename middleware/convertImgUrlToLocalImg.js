const fs = require("fs");
const fetch = require("node-fetch");

const storeFileToLocalDisk = async (req, res, next) => {
  const { imgs } = req.body;
  const imagesPath = [];
  for (const url of imgs) {
    const response = await fetch(url);
    const splitedUrl = url.split("/");
    const processedUrl = `${Date.now()}-${
      splitedUrl[splitedUrl.length - 1].split(".")[0]
    }`;

    imagesPath.push(`${processedUrl}.png`);

    const buffer = await response.buffer();
    fs.writeFile(`./images/${processedUrl}.png`, buffer, () => {
      // console.log(`${processedUrl}.png`);
    });
  }
  req.imgsUrl = imagesPath;
  next();
};

module.exports = storeFileToLocalDisk;
