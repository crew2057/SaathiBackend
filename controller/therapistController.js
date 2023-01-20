import therapist from "../data/therapistDummy.json" assert { type: "json" };
import asyncHandler from "express-async-handler";

import { userModel } from "../model/userModel.js";
const getTherapistDummy = asyncHandler(async (req, res) => {
  res.json(therapist);
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
  if (!update) {
    res.status(500);
    throw new Error("therapist not found");
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
  if (!therapist) {
    res.status(500);
    throw new Error("therapist not found");
  }
  const deletedTherapist = await userModel.findByIdAndDelete(req.params.id);
  res.json({ deletedTherapist, message: `therapist deleted ${req.params.id}` });
});
export { getTherapistDummy, getTherapist };
