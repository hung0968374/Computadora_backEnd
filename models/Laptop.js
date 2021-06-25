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
    default: "2kg",
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
    default: ["Laptop xin vl", "asdasds"],
  },
  genre: {
    type: String,
    default: "laptop",
  },
});

module.exports = mongoose.model("laptops", LaptopSchema);
