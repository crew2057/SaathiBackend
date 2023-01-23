import mongoose from "mongoose";
const therapistDetailSchema = mongoose.Schema({
  speciality: {
    type: String,
  },
  communicationType: {
    type: String,
    enum: ["virtual", "physical"],
  },
  prefferedGender: {
    type: String,
    enum: ["male", "female", "other"],
  },
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
  },
  therapistDetails: [therapistDetailSchema],
});

export const userModel = mongoose.model("User", userSchema);
