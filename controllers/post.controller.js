import PostModel from "../models/post.model.js";
import mongoose from "mongoose";

import { Readable } from "stream";

import { uploadToCloudinary } from "../utils/cloudinary.js";

import getAuth from "../utils/getAuth.js";

const ID = mongoose.Types.ObjectId;

export const readPost = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);

  try {
    const posts = await PostModel.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },

      {
        $unwind: { path: "$comments", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "replies",
          localField: "comments._id",
          foreignField: "commentId",
          as: "replies",
        },
      },
      {
        $unwind: { path: "$replies", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          "replies.likesCount": {
            $ifNull: [
              {
                $size: {
                  $ifNull: ["$replies.likes", []],
                },
              },
              {},
            ],
          },
          "replies.isLiked": {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: {
                      $ifNull: [
                        {
                          $filter: {
                            input: "$replies.likes",
                            as: "item",
                            cond: {
                              $eq: [
                                "$$item",
                                uid, //id of the user whom you wanna check if liked the reply
                              ],
                            },
                          },
                        },
                        [],
                      ],
                    },
                  },
                  0,
                ],
              },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $group: {
          _id: "$comments._id",
          postId: {
            $first: "$_id",
          },
          createdAt: { $first: "$createdAt" },
          creator: { $first: "$creator" },
          creatorId: { $first: "$creatorId" },
          likes: { $first: "$likes" },
          //commentsCount: { $first: { $size: "$comments" } },
          body: { $first: "$body" },
          comments: {
            $first: "$comments",
          },
          replies: { $push: "$replies" },
        },
      },
      {
        $addFields: {
          "comments.replies": "$replies",
          "comments.likesCount": {
            $ifNull: [
              {
                $size: {
                  $ifNull: ["$comments.likes", []],
                },
              },
              {},
            ],
          },
          "comments.isLiked": {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: {
                      $ifNull: [
                        {
                          $filter: {
                            input: "$comments.likes",
                            as: "item",
                            cond: {
                              $eq: [
                                "$$item",
                                uid, //id of the user whom you wanna check if liked the reply
                              ],
                            },
                          },
                        },
                        [],
                      ],
                    },
                  },
                  0,
                ],
              },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $group: {
          _id: "$postId",

          createdAt: { $first: "$createdAt" },
          creator: { $first: "$creator" },
          creatorId: { $first: "$creatorId" },
          likesCount: { $first: { $size: "$likes" } },
          liked: { $first: { $in: [uid, "$likes"] } },
          //commentsCount: { $first: { $size: "$comments" } },
          body: { $first: "$body" },
          comments: {
            $push: "$comments",
          },
        },
      },
    ]).sort({ createdAt: -1 });
    return res.status(200).send(posts);
  } catch (error) {
    return res.status(500).send(JSON.stringify(error.message));
  }
};
export const createPost = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);
  if (req.body.body !== "" && req.file !== undefined) {
    try {
      if (
        req.file.mimetype != "image/jpg" &&
        req.file.mimetype != "image/png" &&
        req.file.mimetype != "image/jpeg"
      )
        throw new Error("invalid file");
      if (req.file.size > 500000) throw new Error("max size");
    } catch (error) {
      // const errors = uploadErrors(err);
      const output = JSON.stringify(error.message);
      console.log(output);
      // return res.status(401).send(error);
    }
    console.log("i got the file");
    const stream = Readable.from(req.file.buffer);
    const uploadImage = await uploadToCloudinary(stream, "post");

    if (!uploadImage.secure_url) {
      throw new Error(
        "Something went wrong while uploading image to Cloudinary"
      );
    }

    imageUrl = uploadImage.secure_url;
    imagePublicId = uploadImage.public_id;
  }

  const newPost = new PostModel({
    creator: req.body.creator,
    creatorId: uid,
    picture: req.file !== undefined ? imageUrl : "",
    title: req.body.title,
    body: req.body.body,
    video: req.body.video,
    likes: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).send(post);
  } catch (err) {
    let errors = {};
    if (err.message.includes("body")) {
      errors.body = "Please say something";
    }
    return res.status(401).send(err);
  }
};
export const updatePost = async (req, res) => {
  const post_ID = req.params.id;
  !ID.isValid(post_ID) && res.status(400).send("ID unknown :" + post_ID);

  const updateRecords = {
    title: req.body.title,
    body: req.body.body,
  };
  const newValues = { $set: updateRecords };

  await PostModel.findByIdAndUpdate(
    post_ID,
    newValues,
    { new: true },
    (err, doc) => {
      !err ? res.send(doc) : console.log("Post Update error" + err);
    }
  );
};
export const deletePost = async (req, res) => {
  const post_ID = req.params.id;
  !ID.isValid(post_ID) && res.status(400).send("ID unknown :" + post_ID);

  await PostModel.findByIdAndRemove(post_ID, (err, docs) => {
    !err ? res.send(docs) : console.log("Delete error " + err);
  });
};

export default { readPost, createPost, deletePost, updatePost };
