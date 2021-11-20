import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import PostModel from "../models/post.model.js";
import getAuth from "../utils/getAuth.js";

const ID = mongoose.Types.ObjectId;

export const getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password");
  res.status(200).json(users);
};

export const userInfo = async (req, res) => {
  !ID.isValid(req.params.id) &&
    res.status(400).send("ID unknown :" + req.params.id);

  await userModel
    .findById(req.params.id, (err, docs) => {
      !err ? res.send(docs) : console.log("ID unknown :" + err);
    })
    .select("-password");
};

export const userUpdate = async (req, res) => {
  !ID.isValid(req.params.id) &&
    res.status(400).send("ID unknown :" + req.params.id);

  try {
    const updateRecords = {
      ...req.body,
    };
    const newValues = { $set: updateRecords };
    const User_ID = req.params.id;

    await userModel.findByIdAndUpdate(
      User_ID,
      newValues,
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        !err
          ? res.status(200).send(docs)
          : res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const deleteUser = async (req, res) => {
  !ID.isValid(req.params.id) &&
    res.status(400).send("ID unknown :" + req.params.id);
  try {
    const user_ID = req.params.id;

    await userModel.deleteOne({ _id: user_ID }).exec();
    res.status(200).json({ message: "user deleted succefully " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const followUser = async (req, res) => {
  if (!ID.isValid(req.params.id) || !ID.isValid(req.body.idToFollow)) {
    res.status(400).send("ID unknown :" + req.params.id);
  }

  try {
    // add to the follower list
    await userModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json({ message_fl: err });
      }
    );

    //add to following list
    await userModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err) => {
        if (err) return res.status(400).json({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const unFollowUser = async (req, res) => {
  if (!ID.isValid(req.params.id) || !ID.isValid(req.body.idToUnFollow)) {
    res.status(400).send("ID unknown :" + req.params.id);
  }
  try {
    // remove to the follower list
    await userModel.findByIdAndUpdate(
      req.params.id,

      {
        //remove
        $pull: { following: req.body.idToUnFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json({ message: err });
      }
    );

    //remove to following list
    await userModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      {
        //remove
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err) => {
        if (err) return res.status(400).json({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const userPosts = async (req, res) => {
  const { uid } = getAuth(req.cookies["jwt"]);
  console.log("====================================");
  console.log(req.params.id);
  console.log("====================================");
  try {
    const posts = await PostModel.aggregate([
      {
        $match: {
          creatorId: req.params.id,
        },
      },
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
export default {
  getAllUsers,
  userUpdate,
  userInfo,
  followUser,
  unFollowUser,
  deleteUser,
  userPosts,
};
