import asyncHandler from "express-async-handler";

import { userModel } from "../model/userModel.js";
import { blogModel } from "../model/blogModel.js";
//therapist id = id, user id =userId

const getTherapistDummy = asyncHandler(async (req, res) => {
  res.json(therapist);
});

export const getAssignedUsers = asyncHandler(async (req, res) => {
  let therapist = await userModel.findById(req.params.id);
  if (!therapist) {
    res.status(400);
  }

  const users = therapist.usersAssigned.map(async (user) => {
    return await userModel.findById(user);
  });

  Promise.all([...users]).then((data) => {
    res.json({ users: data });
  });
});
const getTherapist = asyncHandler(async (req, res) => {
  const therapists = await userModel.find({ role: "therapist" });
  res.json(therapists);
});
export const updateTherapist = asyncHandler(async (req, res) => {
  const update = await userModel.find({
    _id: req.params.id,
    role: "therapist",
  });
  const user = await userModel.findById(req.user.id);
  if (!update) {
    res.status(500);
    throw new Error("therapist not found");
  }
  if (update.id.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedTherapist = await userModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTherapist);
});
export const deleteTherapist = asyncHandler(async (req, res) => {
  const therapist = await userModel.findOne({
    _id: req.params.id,
    role: "therapist",
  });
  const user = await userModel.findById(req.user.id);
  if (!therapist) {
    res.status(500);
    throw new Error("therapist not found");
  }
  if (therapist.id.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const deletedTherapist = await userModel.findByIdAndDelete(req.params.id);
  res.json({ deletedTherapist, message: `therapist deleted ${req.params.id}` });
});

export const getTherapistBlogs = asyncHandler(async (req, res) => {});
export { getTherapistDummy, getTherapist };
