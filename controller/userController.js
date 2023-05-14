import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { userModel } from "../model/userModel.js";
import { generateToken } from "./loginController.js";

//method get
//needs user id in request body
//returns therapist account info
export const getAssignedTherapist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(500);
    throw new Error("Invalid request");
  }
  const therapistId = user.therapistAssigned;
  const therapist = await userModel.findById(therapistId);
  if (!therapist) {
    res.status(400);
    throw new Error("Therapist not found");
  }
  res.json(therapist);
});

//method post
//needs user id and therapist in request body
//updates user therapist
export const AssignTherapist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.body.id);
  if (!user) {
    res.status(500);
    throw new Error("Invalid request");
  }
  const assignedTherapist = await userModel.findById(req.body.therapistId);
  if (!assignedTherapist) {
    res.status(403);
    throw new Error("Therapist not found");
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.body.id,
    {
      therapistAssigned: assignedTherapist._id,
    },
    { new: true }
  );
  const updatedTherapist = await userModel.findByIdAndUpdate(
    req.body.therapistId,
    {
      usersAssigned: [...assignedTherapist.usersAssigned, req.body.id],
    },
    { new: true }
  );
  res.json({ updatedTherapist, message: "Therapist assigned" });
});
export const unAssignTherapist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.body.id);
  if (!user) {
    res.status(500);
    throw new Error("Invalid request");
  }
  const assignedTherapist = await userModel.findById(user.therapistAssigned);
  if (!assignedTherapist) {
    res.status(403);
    throw new Error("Therapist not found");
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.body.id,
    {
      therapistAssigned: "",
    },
    { new: true }
  );
  const updatedTherapist = await userModel.findByIdAndUpdate(
    user.therapistAssigned,
    {
      usersAssigned: [
        ...assignedTherapist.usersAssigned.filter((therapist) => {
          return therapist !== req.body.id;
        }),
      ],
    },
    { new: true }
  );
  res.json({ updatedTherapist, message: "Therapist unAssigned" });
});

//find related therapist speciality
// "Family"---"Divorce"5,"Child"4,"Trauma"3,"Social"2,"Behaviour"1,
//"Addiction",----"Eating-Disorder""Behaviour""Cognitive""Clinical","Exercise"
//"Behaviour","Cognitive","Cognitive-Behavioral","Youth",
//"Divorce","Family","Social"2,"Behaviour"1,
//"Child","Family","Social"2,"Behaviour"1,
//"Clinical","Cognitive""Cognitive-Behavioral""Psychodynamic"
//"Cognitive","Cognitive-Behavioral","Clinical""Trauma"
//"Eating-Disorder""Addiction","Nutritional""Exercise""Psychodynamic"
//"Cognitive-Behavioral","Cognitive""Clinical""Behaviour
//"Exercise","Behaviour""Cognitive-Behavioral"
//"Youth","SocialWork""School""Trauma"
//"SocialWork","Youth""School""Trauma"
//"School","Trauma","Youth","Behaviour""
//"Trauma","Behaviour","Youth",
//"Nutritional","Behaviour""Exercise"
//"Social","Behaviour""Trauma""SocialWork"
//"Dialect-Bheaviour","Behaviour""Cognitive-Behavioral"
//"Psychodynamic""Dialect-Bheaviour","Behaviour""Cognitive-Behavioral"

//get therapist from need and related array
const findTherapist = async (specialities) => {
  let therapistFound = [];
  const promises = specialities.map(async (speciality) => {
    return userModel.find({
      role: "therapist",
      "therapistDetails.speciality": speciality,
    });
  });
  await Promise.all(promises).then((therapists) => {
    therapistFound = therapists.filter((t) => t != null)[0];
  });
  return therapistFound;
};
const Related = async (speciality) => {
  switch (speciality) {
    case "Family":
      return findTherapist([
        "Divorce",
        "Child",
        "Trauma",
        "Social",
        "Behaviour",
      ]).then((therapist) => {
        return therapist;
      });

    case "Addiction":
      return findTherapist([
        "Eating-Disorder",
        "Cognitive",
        "Clinical",
        "Exercise",
      ]).then((therapist) => {
        return therapist;
      });
    case "Behaviour":
      return findTherapist(["Cognitive", "Cognitive-Behavioral", "Youth"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Divorce":
      return findTherapist(["Family", "Social", "Behaviour"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Child":
      return findTherapist(["Family", "Social", "Behaviour"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Clinical":
      return findTherapist([
        "Cognitive",
        "Cognitive-Behavioral",
        "Psychodynamic",
      ]).then((therapist) => {
        return therapist;
      });
    case "Cognitive":
      return findTherapist(["Cognitive-Behavioral", "Clinical", "Trauma"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Eating-Disorder":
      return findTherapist([
        "Addiction",
        "Nutritional",
        "Exercise",
        "Psychodynamic",
      ]).then((therapist) => {
        return therapist;
      });
    case "Cognitive-Behavioral":
      return findTherapist(["Cognitive", "Clinical", "Behaviour"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Exercise":
      return findTherapist(["Behaviour", "Cognitive-Behavioral"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Youth":
      return findTherapist(["SocialWork", "School", "Trauma"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "SocialWork":
      return findTherapist(["Youth", "School", "Trauma"]).then((therapist) => {
        return therapist;
      });
    case "School":
      return findTherapist(["Trauma", "Youth", "Behaviour"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Trauma":
      return findTherapist(["Behaviour", "Youth"]).then((therapist) => {
        return therapist;
      });
    case "Nutritional":
      return findTherapist(["Behaviour", "Exercise"]).then((therapist) => {
        return therapist;
      });
    case "Social":
      return findTherapist(["Behaviour", "Trauma", "SocialWork"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Dialect-Bheaviour":
      return findTherapist(["Behaviour", "Cognitive-Behavioral"]).then(
        (therapist) => {
          return therapist;
        }
      );
    case "Psychodynamic":
      return findTherapist([
        "Dialect-Bheaviour",
        "Behaviour",
        "Cognitive-Behavioral",
      ]).then((therapist) => {
        return therapist;
      });
  }
};

//method get
//needs user id in request body
//returns therapist account info
export const RecommendTherapist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(500);
    throw new Error("Invalid request");
  }
  let userNeeds = user.therapistDetails;

  let therapist = await userModel.find({
    role: "therapist",
    "therapistDetails.speciality": userNeeds.speciality,
  });

  if (!therapist.length) {
    let relatedTherapist = await Related(userNeeds.speciality);

    if (relatedTherapist) {
      therapist = relatedTherapist;
    } else {
      res.status(400);
      res.json({ message: "therapist not found" });
    }
  }
  let genderFilteredTherapist = therapist.filter((t) => {
    if (userNeeds.gender === "Any") {
      return t;
    }
    return t.gender === userNeeds.gender.toLowerCase();
  });
  let ageFilteredTherapist;
  if (genderFilteredTherapist) {
    ageFilteredTherapist = genderFilteredTherapist.filter((t) => {
      switch (userNeeds.age) {
        case "Old(Above 40)":
          return t.age > 40;
        case "Adult(Between 30-40)":
          return t.age >= 30 && t.age <= 40;
        case "YoungAdult(Between 20-30)":
          return t.age >= 20 && t.age <= 30;
        case "Any":
          return t;
      }
    });
  } else {
    ageFilteredTherapist = therapist.filter((t) => {
      switch (userNeeds.age) {
        case "Old(Above 40)":
          return t.age > 40;
        case "Adult(Between 30-40)":
          return t.age >= 30 && t.age <= 40;
        case "YoungAdult(Between 20-30)":
          return t.age >= 20 && t.age <= 30;
        case "Any":
          return t;
      }
    });
  }
  if (ageFilteredTherapist.length > 0) {
    let finalFilter = ageFilteredTherapist.filter((t) => {
      return (
        t.therapistDetails.communicationType === userNeeds.communicationType
      );
    });
    if (finalFilter.length > 0) {
      res.json({
        recommendedTherapist: finalFilter[0],
      });
    } else {
      res.json({
        recommendedTherapist: ageFilteredTherapist[0],
      });
    }
  } else {
    let finalFilter = therapist.filter((t) => {
      return (
        t.therapistDetails.communicationType === userNeeds.communicationType
      );
    });
    if (finalFilter.length > 0) {
      res.json({
        recommendedTherapist: finalFilter[0],
      });
    } else {
      res.json({
        recommendedTherapist: therapist[0],
      });
    }
  }
});

export const getUserDummy = asyncHandler(async (req, res) => {
  res.json(user);
});

export const getUser = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  if (!users) {
    res.status(300);
    res.json({ message: "no users" });
  }
  res.json(users);
});

export const setUser = asyncHandler(async (req, res) => {
  const { email, password, role, fullName } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await userModel.findOne({ email });
  if (user) {
    res.status(400);
    res.json({ message: "user already exists" });
  } else {
    if (role === "therapist") {
      if (!fullName) {
        res.status(400);
        res.json({ message: "enter full name" });
      }
    }
    const createdUser = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.json({
      createdUser,
      role,
      id: createdUser._id,
      token: generateToken(createdUser._id),
    });
  }
});

export const getUserByID = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    res.status(400);
    res.json({ message: "User not found" });
  }
  res.json({ user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const update = await userModel.findById(req.params.id);
  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.status(400);
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
