import mongoose from "mongoose";
const CommentSchema = mongoose.Schema(
  {
    replyId: { type: mongoose.Schema.Types.ObjectId, ref: "replies" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "articles" },
    isReady: {
      type: Boolean,
      default: true,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    timestamp: Number,

    body: {
      type: String,
      required: true,
      maxlength: 200,
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

export default mongoose.model("comment", CommentSchema);
