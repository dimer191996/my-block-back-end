import PostModel from "../models/post.model.js";
import mongoose from "mongoose";
import getAuth from "../utils/getAuth.js";
import CommentModel from "../models/comment.model.js";
import ReplyModel from "../models/reply.model.js";

const ID = mongoose.Types.ObjectId;

export const like_post = async (req, res, next) => {
  const { uid } = getAuth(req.cookies["jwt"]);

  const post_ID = req.params.id;
  !ID.isValid(post_ID) && res.status(400).send("ID unknown :" + post_ID);

  if (!uid) {
    res.status(400).send({ error: "Unauthorize action" });
    return next();
  }
  try {
    const newLike = { likes: uid };
    const addLike = { $addToSet: newLike };
    await PostModel.findByIdAndUpdate(
      post_ID,
      addLike,
      { new: true },
      (err, docs) => {
        !err ? res.status(200).send(docs) : console.log(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
export const unlike_post = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);
  const post_ID = req.params.id;
  !ID.isValid(post_ID) && res.status(400).send("ID unknown :" + post_ID);
  if (!uid) {
    res.status(400).send({ error: "Unauthorize action" });
    return next();
  }
  try {
    const newLike = { likes: uid };
    const addLike = { $pull: newLike };
    await PostModel.findByIdAndUpdate(
      post_ID,
      addLike,
      { new: true },
      (err, docs) => {
        !err ? res.status(200).send(docs) : console.log(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
export const like_comment = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);
  const post_ID = req.params.id;
  const comment_ID = req.body.commentId;

  if (!ID.isValid(post_ID) || !ID.isValid(comment_ID) || !ID.isValid(uid)) {
    return res
      .status(400)
      .send("ID unknown :" + post_ID + "-" + comment_ID + "-" + uid);
  }

  try {
    await CommentModel.findOneAndUpdate(
      { _id: comment_ID },
      { $addToSet: { likes: uid } },
      {
        new: true,
      },
      (err, doc) => {
        if (!err)
          return res.status(200).send({
            message: {
              message: "Success ",
              from: doc.likes[doc.likes.length - 1],
            },
          });
        return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
export const unlike_comment = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);

  const post_ID = req.params.id;
  const comment_ID = req.body.commentId;

  if (!ID.isValid(post_ID) || !ID.isValid(comment_ID)) {
    return res.status(400).send("ID unknown :" + post_ID + "-" + comment_ID);
  }

  try {
    const comment = await CommentModel.findById(comment_ID);
    if (comment) {
      comment.likes = comment.likes.filter((like) => like !== uid);
      await comment.save();
      return res.status(200).send({
        message: {
          message: "Success ",
        },
      });
    }
  } catch (err) {
    return res.status(400).send(JSON.stringify(err));
  }
};
export const like_reply = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);
  const post_ID = req.params.id;
  const reply_ID = req.body.replyId;

  if (!ID.isValid(post_ID) || !ID.isValid(reply_ID) || !ID.isValid(uid)) {
    return res
      .status(400)
      .send("ID unknown :" + post_ID + "-" + reply_ID + "-" + uid);
  }

  try {
    await ReplyModel.findOneAndUpdate(
      { _id: reply_ID },
      { $addToSet: { likes: uid } },
      {
        new: true,
      },
      (err, doc) => {
        if (!err)
          return res.status(200).send({
            message: {
              isError: doc.isError,
              isReady: doc.isReady,
              message: "Liked Successfully",
            },
          });
        return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
export const unlike_reply = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);

  const post_ID = req.params.id;
  const reply_ID = req.body.replyId;

  if (!ID.isValid(post_ID) || !ID.isValid(reply_ID)) {
    return res.status(400).send("ID unknown :" + post_ID + "-" + reply_ID);
  }

  try {
    const reply = await ReplyModel.findById(reply_ID);
    if (reply) {
      reply.likes = reply.likes.filter((like) => like !== uid);
      await reply.save();
      return res.status(200).send({
        message: {
          isError: reply.isError,
          isReady: reply.isReady,
          message: "DisLiked Successfully",
        },
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};
export default {
  like_comment,
  like_post,
  unlike_comment,
  unlike_post,
  like_reply,
  unlike_reply,
};
