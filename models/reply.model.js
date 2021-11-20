import mongoose from "mongoose";
const ReplySchema = mongoose.Schema(
  {
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
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
      trim: true,
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

export default mongoose.model("reply", ReplySchema);
