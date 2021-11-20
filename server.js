import express from "express";
import session from "express-session";
import cloudinary from "cloudinary";

import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });

//monngo db connect
import "./config/db.js";

//auth middleware
import { checkUser, checkAuth } from "./middleware/auth.middleware.js";

import cors from "cors";

//express
const app = express();

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["https://www.hotseatmag.com"],
  })
);

app.use(
  session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true, httpOnly: true, sameSite: "none" },
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

// cloudinary configuration
const cloud = cloudinary.v2;

cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//cookies
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", checkAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// connect to the express server
app.listen(process.env.PORT || 5000, () => {
  console.log(`lestening port ${process.env.PORT}`);
});
