import UserModel from "../models/user.model.js";
import fs from "fs";
import { Readable } from "stream";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

export const uploadProfile = async (req, res) => {
  try {
    console.log("wtf");
    console.log(req.file);
    if (
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/png" &&
      req.file.mimetype !== "image/jpeg"
    )
      return res.status(500).json({ message: "File Not Supported" });

    if (req.file.size > 500000)
      return res.status(500).json({ message: "File is Too Big" });
  } catch (err) {
    return res.status(500).json(err);
  }

  const fileName = req.body.name + ".jpg";
  const stream = Readable.from(req.file.buffer);

  await pipeline(
    stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profile/${fileName}`
    )
  );

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { picture: "./uploads/profile/" + fileName },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, doc) => {
        !err ? res.send(doc) : res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
export default { uploadProfile };
