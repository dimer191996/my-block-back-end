import mongoose from "mongoose";
const PostSchema = mongoose.Schema(
  {
    creatorId: {
      type: String,
      trim: true,
      required: true,
    },
    creator: {
      type: String,
      trim: true,
      required: true,
    },
    creatorId: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      maxlength: 80,
    },
    body: {
      type: String,
      trim: true,
      maxlength: 250,
      required: true,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    likes: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("post", PostSchema);
