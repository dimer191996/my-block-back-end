import jwt from "jsonwebtoken";

export const createUserToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: 2 * 24 * 24 * 60 * 1000,
  });
};
