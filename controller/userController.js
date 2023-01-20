import user from "../data/userDummy.json" assert { type: "json" };
import asyncHandler from "express-async-handler";
import { userModel } from "../model/userModel.js";
const getUserDummy = asyncHandler(async (req, res) => {
  res.json(user);
});
export const getUser = asyncHandler(async (req, res) => {
  const users = await userModel.find();

  res.json(users);
});
export const setUser = asyncHandler(async (req, res) => {
  const user = await userModel.create(req.body);
  res.json({ user });
});
export const updateUser = asyncHandler(async (req, res) => {
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
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);
  res.json({ deletedUser, message: `therapist deleted ${req.params.id}` });
});
export { getUserDummy };
