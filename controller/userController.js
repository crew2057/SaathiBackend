import user from "../data/userDummy.json" assert { type: "json" };
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../model/userModel.js";

export const getUserDummy = asyncHandler(async (req, res) => {
  res.json(user);
});

export const getUser = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

export const setUser = asyncHandler(async (req, res) => {
  const { email, password, role, fullName } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await userModel.findOne({ email });
  if (user) {
    throw new Error("user already exists");
  }
  if (role === "therapist") {
    if (!fullName) {
      throw new Error("enter full name");
    }
  }
  const createdUser = await userModel.create({
    ...req.body,
    password: hashedPassword,
  });
  res.json({ createdUser, role });
});

export const updateUser = asyncHandler(async (req, res) => {
  const update = await userModel.findById(req.params.id);
  const user = await userModel.findById(req.user.id);
  if (!user) {
    throw new Error("user not found");
  }
  if (update.id.toString() !== user.id) {
    throw new Error("user doesnot match");
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json({ updatedUser });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await userModel.findById(req.params.id);
  const user = await userModel.findById(req.user.id);
  if (!user) {
    throw new Error("User doesnot exist ");
  }
  if (deleted.id.toString() !== user.id) {
    throw new Error("User not authorized");
  }
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);
  res.json({ deletedUser, message: `therapist deleted ${req.params.id}` });
});

//login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for email

  const user = await userModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ user, token: generateToken(user._id) });
  } else {
    res.json(req.body);
    throw new Error("Please enter valid credentials");
  }
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
