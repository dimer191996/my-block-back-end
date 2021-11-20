import mongoose from "mongoose";
import ReplyModel from "../models/reply.model.js";

const ID = mongoose.Types.ObjectId;

export const createReply = async (req, res, next) => {
  const user_ID = req.body.creatorId;
  const postId = req.params.id;
  const comment_ID = req.body.commentId;

  if (!ID.isValid(user_ID) && !ID.isValid(postId) && !ID.isValid(comment_ID)) {
    return res.status(400).send("ID unknown");
  }
  if (!req.body.body.trim()) {
    return res.status(401).send({ message: "Body empty", type: "validation" });
  }

  const newReply = new ReplyModel({
    commentId: comment_ID,
    postId: postId,
    creatorId: user_ID,
    creator: req.body.creator,
    body: req.body.body,
    timestamp: new Date().getTime(),
  });
  try {
    const reply = await newReply.save();
    return res.status(201).send(reply);
  } catch (err) {
    return res
      .status(500)
      .send({ type: "network", message: JSON.stringify(err.message) });
  }
};
export const updateReply = async (req, res) => {
  console.log(req);
};
export const deleteReply = async (req, res) => {
  const postId = req.body.postId;
  const comment_ID = req.body.commentId;
  const reply_ID = req.body.replyId;

  if (!ID.isValid(reply_ID) && !ID.isValid(postId) && !ID.isValid(comment_ID)) {
    return res.status(400).send("ID unknown");
  }
  try {
    await ReplyModel.findOneAndRemove(reply_ID, (err) => {
      if (!err)
        return res.status(201).send({ message: "Reply Deleted Successfully " });
      return res.status(400).send(err);
    });
  } catch (error) {
    console.log("replies", error);
  }
};

export default { createReply, deleteReply, updateReply };
