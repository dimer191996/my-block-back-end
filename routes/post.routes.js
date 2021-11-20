import express from "express";
import postController from "../controllers/post.controller.js";
import commentController from "../controllers/comment.controller.js";
import replyController from "../controllers/reply.controller.js";
import likeController from "../controllers/like.controller.js";
//crud post
import multer from "multer";
const upload = multer();
const app = express.Router();

app.get("/", postController.readPost);
app.post("/", upload.single("file"), postController.createPost);
app.put("/:id", postController.updatePost);
app.delete("/:id", postController.deletePost);

//like and dislike post
app.patch("/like-post/:id", likeController.like_post);
app.patch("/dislike-post/:id", likeController.unlike_post);

//create a comment + UD comment
app.patch("/comment-create/:id", commentController.createComment);
app.patch("/comment-edit/:id", commentController.updateComment);
app.patch("/comment-delete/:id", commentController.deleteComment);
app.get("/comments/:postId", commentController.getArticleComments);
//like comment dislike comment
app.patch("/like-comment/:id", likeController.like_comment);
app.patch("/dislike-comment/:id", likeController.unlike_comment);

//create reply to a comment + RUD reply
app.patch("/reply-create/:id", replyController.createReply);
app.patch("/reply-edit/:id", replyController.updateReply);
app.patch("/reply-delete/:id", replyController.deleteReply);

//like comment dislike comment
app.patch("/like-reply/:id", likeController.like_reply);
app.patch("/dislike-reply/:id", likeController.unlike_reply);

export default app;
