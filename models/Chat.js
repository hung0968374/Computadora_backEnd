const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  message: String,
  name: String,
  received: Boolean,
});
module.exports = mongoose.model("chat", ChatSchema);
