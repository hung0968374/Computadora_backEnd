const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PcSchema = new Schema({
  imgs: {
    type: Array,
  },
  title: {
    type: String,
    default: "",
  },
  processor: {
    type: String,
    default: "",
  },
  ram: {
    type: String,
    default: "",
  },
  graphicCard: {
    type: String,
    default: "",
  },
  operatingSystem: {
    type: String,
    default: "Hệ điều hành: Windows 10 bản quyền",
  },
  price: {
    type: String,
    default: "",
  },
  ssd: {
    type: String,
    default: "",
  },
  review: {
    type: Array,
    default: [],
  },
  genre: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pc", PcSchema);
