const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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
  screen: {
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
  pin: {
    type: String,
    default: "",
  },
  weight: {
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

  review: {
    type: Array,
    default: [],
  },
  genre: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("posts", PostSchema);
