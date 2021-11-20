import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 20,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      max: 1024,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 12,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "./uploads/profile/avatar.png",
    },
    following: {
      type: [String],
    },
    followers: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// userSchema.statics.login = async function (name, password) {
//   const user = await this.findOne({ name });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return "user";
//     }
//     throw Error("Incorrect password");
//   }
//   throw Error("User not fund");
// };

export default mongoose.model("user", userSchema);
