import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  time: { type: Date, default: Date.now },
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;