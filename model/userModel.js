import mongoose from "mongoose";
const therapistDetailSchema = mongoose.Schema({
  age: String,
  speciality: {
    type: String,
  },
  communicationType: {
    type: String,
    enum: ["Virtual", "Physical", "Any"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Any"],
  },
});
const questionSchema = mongoose.Schema({
  question: String,
  answer: String,
});
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "please add text"],
  },
  fullName: {
    type: String,
  },
  age: {
    type: Number,
    required: [true, "Please enter age"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  gender: {
    type: String,
    required: [true, "please state your gender"],
    enum: ["male", "female", "other"],
  },
  phoneno: {
    type: Number,
    required: [true, "please state your  phone number"],
  },
  address: {
    type: String,
    required: [true, "please state your address"],
  },
  role: {
    type: String,
    enum: ["user", "therapist"],
  },
  password: {
    type: String,
    required: [true, "Please give password"],
  },
  userInfo: [questionSchema],
  therapistAssigned: String,
  therapistDetails: therapistDetailSchema,
  usersAssigned: [String],
});

export const userModel = mongoose.model("User", userSchema);
