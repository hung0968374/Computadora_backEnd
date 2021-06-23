const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LaptopSchema = new Schema({
  imgs: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  processor: {
    type: String,
    required: true,
  },

  screen: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
    required: true,
  },
  graphicCard: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  operatingSystem: {
    type: String,
    default: "Hệ điều hành: Windows 10 bản quyền",
  },
  price: {
    type: String,
    required: true,
  },

  review: {
    type: Array,
    required: true,
  },
  genre: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("laptops", LaptopSchema);
