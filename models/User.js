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
      "https://banner2.cleanpng.com/20180822/gwx/kisspng-security-hacker-hoodie-portable-network-graphics-i-5b7da10401b369.199557191534959876007.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("userInfo", UserSchema);
