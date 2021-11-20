import mongoose from "mongoose";
import validator from "validator";
const ContactSchema = mongoose.Schema(
  {
    body: {
      type: String,
      trim: true,
      maxlength: 250,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      validate: [validator.isEmail],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("contact", ContactSchema);
