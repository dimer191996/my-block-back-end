import UserModel from "../models/user.model.js";
import { createUserToken } from "../utils/createUserToken.util.js";
import { signUpValidator } from "../utils/validators.util.js";
// import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import random_name from "node-random-name";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.create({
      name: random_name(),
      email,
      password,
    });

    // sgMail.setApiKey(
    //   "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"
    // );
    // const msg = {
    //   to: email, // Change to your recipient
    //   from: "next191996@gmail.com", // Change to your verified sender
    //   subject: "Email Verification",
    //   text: "Welcome To the HotSeatMagazine | Comfirm your Email to continue",
    //   html: `Hello  ! Click   To COMFIRM Your Email`,
    // };
    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log("Email sent");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    return res.status(201).json({ user: user });
  } catch (err) {
    const errors = signUpValidator(err);
    return res.status(200).send({ errors });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  let errors = { email: "", password: "", verify_email: "" };
  try {
    const user = await UserModel.findOne({ email });

    // if (user && !user.verified) {
    //   errors.verify_email = "Please Comfirm Your Email";
    //   return res.status(201).json({ errors });
    // }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        //create a user token
        const token = createUserToken(user._id);

        //generate a cookie and  store the token
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 2 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
        });
        //return the authenticated user id
        res.status(200).json({ user: user._id });
      } else {
        errors.password = "Password is incorrect, please try again";
        return res.status(201).json({ errors });
      }
    } else {
      errors.email = "Email not found";
      return res.status(201).json({ errors });
    }
  } catch (error) {
    res.cookie("jwt", "", {
      maxAge: 1,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    console.log(error);
  }
};
export const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1, sameSite: "none", secure: true });
  res.redirect("/login");
};

export default { login, logout, signup };
