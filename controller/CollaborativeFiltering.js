import asyncHandler from "express-async-handler";

import { userModel } from "../model/userModel.js";
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((acc, curr, i) => acc + curr * b[i], 0);
  const normA = Math.sqrt(a.reduce((acc, curr) => acc + curr * curr, 0));
  const normB = Math.sqrt(b.reduce((acc, curr) => acc + curr * curr, 0));
  return dotProduct / (normA * normB);
}
export const collaborative = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(500);
    res.json({ message: "user not found" });
  }

  const userNeedObject = user.therapistDetails.toObject();

  const userNeeds = Object.keys(userNeedObject).filter((val, index) => {
    return val !== "_id";
  });
  const userNeedsVector = Object.values(userNeeds).map((val, index) => {
    if (val === "Any") return 0;
    return 1;
  });

  // Age,gender,medium,speciality
  const therapists = await userModel.find({
    role: "therapist",
  });

  if (!therapists) {
    res.status(500);
    res.json({ message: "therapist not found" });
  }

  let maxSimilarity = -1;
  let bestTherapist;
  therapists.forEach((therapist) => {
    let vector = [];
    // for age
    if (userNeedsVector[0] !== 0) {
      switch (user.therapistDetails.age) {
        case "Old(Above 40)":
          if (therapist.age > 40) vector.push(1);
          else vector.push(0);
          break;

        case "Adult(Between 30-40)":
          if (therapist.age >= 30 && therapist.age <= 40) vector.push(1);
          else vector.push(0);
          break;

        case "YoungAdult(Between 20-30)":
          if (therapist.age >= 20 && therapist.age >= 30) vector.push(1);
          else vector.push(0);
          break;

        case "Any":
          vector.push(1);
          break;
      }
    } else {
      vector.push(1);
    }

    //for gender
    if (userNeedsVector[1] !== 0) {
      therapist.gender === user.therapistDetails.gender.toLowerCase()
        ? vector.push(1)
        : vector.push(0);
    } else {
      vector.push(1);
    }

    //for medium
    // if (userNeedsVector[2] !== 0) {
    //   if (user.therapistDetails.medium.toLowerCase() !== "any") {
    //     therapist.medium === user.therapistDetails.medium.toLowerCase()
    //       ? vector.push(1)
    //       : vector.push(0);
    //   } else {
    //     vector.push(1);
    //   }
    // } else {
    //   vector.push(1);
    // }
    //for specialist

    if (userNeedsVector[2] !== 0) {
      therapist.therapistDetails.speciality === user.therapistDetails.speciality
        ? vector.push(1)
        : vector.push(0);
    }

    const similarity = cosineSimilarity(vector, userNeedsVector);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestTherapist = therapist;
    }
    console.log(similarity, bestTherapist, therapist);
  });
  if (bestTherapist === undefined) {
    res.status(400);
    res.json({
      message: "Therapist not found",
    });
  }
  res.json({
    bestTherapist,
  });
});
