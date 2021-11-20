import jwt from "jsonwebtoken";

export default (token) => {
  let uid;
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      uid = decodedToken.id;
    }
  });
  return { uid };
};
