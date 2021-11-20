import express from "express";
import multer from "multer";
import authController from "../controllers/auth.controller.js";
import userController from "../controllers/user.controller.js";
import uploadController from "../controllers/upload.controller.js";
import contactController from "../controllers/contact.controller.js";
const upload = multer();
const app = express.Router();

//auth controller
app.post("/register", authController.signup);
app.post("/login", authController.login);
app.post("/logout", authController.logout);

//get all the user in our aplication
app.get("/", userController.getAllUsers);

//get aspecific user
app.get("/:id", userController.userInfo);

//update the user
app.put("/:id", userController.userUpdate);

//update the user
app.delete("/:id", userController.deleteUser);

//follow and unfollow users
app.patch("/follow/:id", userController.followUser);
app.patch("/unfollow/:id", userController.unFollowUser);

//
app.post("/upload", upload.single("file"), uploadController.uploadProfile);

//profile/auth user posts
app.get("/post/:id", userController.userPosts);
//
//user contact
app.post("/contact/send", contactController.sendContactForm);

export default app;
