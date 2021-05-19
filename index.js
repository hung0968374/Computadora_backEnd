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
const userRouter = require("./routes/user");
const pcRouter = require("./routes/Pc");
var bodyParser = require("body-parser");

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
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
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
        commentId: messageDetails._id,
        userIdSentComment:
          messageDetails.user.googleId ||
          messageDetails.user._id ||
          messageDetails.user.facebookUserId,
      });
    } else if (change.operationType === "delete") {
      const idCommentDeleted = change.documentKey._id;
      // console.log("cmt id deleted", idCommentDeleted);
      pusher.trigger("comment", "deleted", {
        idCommentDeleted,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

const app = express();
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to computadora-api");
});
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/pcs", pcRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/comment", commentRouter);
app.use("/api/user", userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
