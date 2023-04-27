import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { userModel } from "../model/userModel.js";
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for email

  const user = await userModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200);
    res.json({ id: user._id, token: generateToken(user._id) });
  } else {
    res.status(400);
    throw new Error("Please enter valid credentials");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
