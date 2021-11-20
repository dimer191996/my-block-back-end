import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

//test if there's a real user on evrysingle page

export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (!err) {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;

        next();
      } else {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        // console.log(res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//require auth check
export const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.sendStatus(400).json({ response: "Unauthorize Action" });
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    res.sendStatus(400).json("Unauthorize Action");
  }
};
