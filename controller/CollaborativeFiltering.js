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
  delete userNeedObject["_id"];

  const userNeedsVector = Object.values(userNeedObject).map((val, index) => {
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
  let similarTherapistArray = [];
  therapists.forEach((therapist) => {
    let vector = [];
    // for age

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

    //for gender
    if (userNeedsVector[1] !== 0) {
      user.therapistDetails.gender.toLowerCase() === "any"
        ? vector.push(1)
        : therapist.gender === user.therapistDetails.gender.toLowerCase()
        ? vector.push(1)
        : vector.push(0);
    }

    user.therapistDetails.speciality === "Any"
      ? vector.push(1)
      : therapist.therapistDetails.speciality ===
        user.therapistDetails.speciality
      ? vector.push(1)
      : vector.push(0);

    user.therapistDetails.communicationType === "Any"
      ? vector.push(1)
      : therapist.therapistDetails.communicationType ===
        user.therapistDetails.communicationType
      ? vector.push(1)
      : vector.push(0);

    if (
      !(
        vector[0] === 0 &&
        vector[1] === 0 &&
        vector[2] === 0 &&
        vector[3] === 0
      )
    ) {
      const similarity = cosineSimilarity(vector, userNeedsVector);
      if (similarity > maxSimilarity) {
        similarTherapistArray = [];
        maxSimilarity = similarity;
        bestTherapist = therapist;
        bestTherapistVector = [...vector];
      }
      if (similarity === maxSimilarity) {
        similarTherapistArray.push(therapist);
      }
    }
  });
  if (similarTherapistArray.length > 0) {
    bestTherapist =
      similarTherapistArray[
        Math.floor(Math.random() * similarTherapistArray.length)
      ];
  }

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

        if (similarity > 0.8) {
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

    //for gender
    if (userNeedsVector[1] !== 0) {
      user.therapistDetails.gender.toLowerCase() === "any"
        ? vector.push(1)
        : therapist.gender === user.therapistDetails.gender.toLowerCase()
        ? vector.push(1)
        : vector.push(0);
    }

    user.therapistDetails.speciality === "Any"
      ? vector.push(1)
      : therapist.therapistDetails.speciality ===
        user.therapistDetails.speciality
      ? vector.push(1)
      : vector.push(0);

    user.therapistDetails.communicationType === "Any"
      ? vector.push(1)
      : therapist.therapistDetails.communicationType ===
        user.therapistDetails.communicationType
      ? vector.push(1)
      : vector.push(0);

    return { vector: vector, therapist: therapist };
  });
  let neededTherapist = [];
  let similarityArray = [];
  let uniqueSimilarTherapists = [];
  for (let i = 0; i <= similarTherapists.length - 1; i++) {
    let clone = false;
    for (let j = 0; j < uniqueSimilarTherapists.length; j++) {
      if (
        similarTherapists[i].therapist.email ===
        similarTherapists[j].therapist.email
      ) {
        clone = true;
      }
    }
    if (similarTherapists[i].therapist.email === bestTherapist.email) {
      clone = true;
    }
    if (!clone) {
      uniqueSimilarTherapists.push(similarTherapists[i]);
    }
  }
  uniqueSimilarTherapists.forEach((similar) => {
    const similarity = cosineSimilarity(similar.vector, bestTherapistVector);

    similarityArray.push({
      similarity: similarity,
      therapist: similar.therapist,
    });
  });

  //find median  therapist .
  function swap(arr, xp, yp) {
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
  }
  for (let i = 0; i <= similarityArray.length - 1; i++) {
    for (let j = 0; j < similarityArray.length - i - 1; j++) {
      if (similarityArray[j].similarity > similarityArray[j + 1].similarity) {
        swap(similarityArray, j, j + 1);
      }
    }
  }

  for (
    let i = Math.floor(similarityArray.length / 2);
    i <= similarityArray.length - 1;
    i++
  ) {
    neededTherapist.push(similarityArray[i].therapist);
  }

  if (neededTherapist !== undefined) {
    res.json({
      therapistToOurPreferences: bestTherapist,
      therapistFromSymptoms: neededTherapist,
    });
  }
});
