import therapist from "../data/therapistDummy.json" assert { type: "json" };
import asyncHandler from "express-async-handler";
import therapistModel from "../model/therapistModel.js";
const getTherapistDummy = asyncHandler(async (req, res) => {
  res.json(therapist);
});
const getTherapist = asyncHandler(async (req, res) => {
  const therapists = await therapistModel.find();
  res.json(therapists);
});
const setTherapist = asyncHandler(async (req, res) => {
  const newTherapist = await therapistModel.create({
    text: req.body.text,
  });

  res.json(newTherapist);
});
export const updateTherapist = asyncHandler(async (req, res) => {
  const update = await therapistModel.findById(req.params.id);
  if (!update) {
    res.status(500);
    throw new Error("therapist not found");
  }
  const updatedTherapist = await therapistModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTherapist);
});
export const deleteTherapist = asyncHandler(async (req, res) => {
  const therapist = await therapistModel.findById(req.params.id);
  res.json({ message: `therapist deleted ${req.params.id}` });
});
export { getTherapistDummy, getTherapist, setTherapist };
