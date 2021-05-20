const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  blogTitle: {
    type: String,
    required: true,
  },
  blogMainImg: {
    type: String,
    required: true,
  },
  blogBody: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("blog", BlogSchema);
