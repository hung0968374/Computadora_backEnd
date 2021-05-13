const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/hacker-background_23-2147900868.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    default: "",
  },
  userPhone: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("userInfo", UserSchema);
