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
  const userSymptoms = user.userSymptoms.toObject();
  delete userSymptoms["_id"];

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
  let bestTherapist; //according to our liking
  let bestTherapistVector = [];
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

    if (userNeedsVector[2] !== 0) {
      therapist.therapistDetails.speciality === user.therapistDetails.speciality
        ? vector.push(1)
        : vector.push(0);
    }

    const similarity = cosineSimilarity(vector, userNeedsVector);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      bestTherapist = therapist;
      bestTherapistVector = [...vector];
    }
  });

  if (bestTherapist === undefined) {
    res.status(400);
    res.json({
      message: "Therapist not found",
    });
  }
  const allUsers = await userModel.find();

  let similarUsers = [];

  if (allUsers.length > 0) {
    for (let use of allUsers) {
      if (use.userSymptoms) {
        let vector = use.userSymptoms.toObject();
        delete vector["_id"];

        const similarity = cosineSimilarity(
          Object.values(vector),
          Object.values(userSymptoms)
        );

        if (similarity > 0.5) {
          similarUsers.push(use);
        }
      }
    }
  }

  if (!(similarUsers.length > 0)) {
    res.json({
      message:
        "There are no similar users to the current user so recommending with users preferences",
      therapist: bestTherapist,
    });
  }
  const similarUserTIds = similarUsers
    .filter((use) => {
      return use.therapistAssigned;
    })
    .map((use) => {
      return use.therapistAssigned;
    });

  const therapistsSimilar = await Promise.all(
    similarUserTIds.map(async (Id) => {
      return await userModel.findById(Id);
    })
  );

  if (!(therapistsSimilar.length > 0)) {
    res.json({
      message:
        "therapists are not asssigned to the similar users so recommending with users own preferences",
      therapist: bestTherapist,
    });
  }
  const similarTherapists = therapistsSimilar.map((therapist) => {
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

    if (userNeedsVector[2] !== 0) {
      therapist.therapistDetails.speciality === user.therapistDetails.speciality
        ? vector.push(1)
        : vector.push(0);
    }
    return { vector: vector, therapist: therapist };
  });
  let neededTherapist;
  let newMaxSimilarity = -1;
  similarTherapists.forEach((similar) => {
    const similarity = cosineSimilarity(similar.vector, bestTherapistVector);
    if (similarity > newMaxSimilarity) {
      newMaxSimilarity = similarity;
      neededTherapist = similar.therapist;
    }
  });
  if (neededTherapist !== undefined) {
    res.json({
      therapistToOurPreferences: bestTherapist,
      therapistFromSymptoms: neededTherapist,
    });
  }
});
