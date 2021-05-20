const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PcSchema = new Schema({
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
  ram: {
    type: String,
    required: true,
  },
  graphicCard: {
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
  ssd: {
    type: String,
    required: true,
  },
  review: {
    type: Array,
    default: [],
  },
  genre: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pc", PcSchema);
