require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
var cors = require("cors");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const invoiceRouter = require("./routes/invoice");
const chatRouter = require("./routes/chat");
const commentRouter = require("./routes/comment");
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jtpsv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log("mongodb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();
const pusher = new Pusher({
  appId: "1188112",
  key: "0489280acfa7987721e1",
  secret: "262b01181ab057d4f796",
  cluster: "ap1",
  useTLS: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("chat collection connected");
  const msgCollection = db.collection("comments");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    // console.log("databased changed", change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("comment", "inserted", {
        name: messageDetails.user.name,
        userImg: messageDetails.user.imageUrl,
        comment: messageDetails.commentContent,
        sentCommentTime: messageDetails.createdAt,
        postId: messageDetails.postId,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/comment", commentRouter);
const PORT = 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
