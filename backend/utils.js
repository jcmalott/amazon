import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./ServerStrings.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
