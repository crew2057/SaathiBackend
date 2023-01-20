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
  age: {
    type: Number,
    required: [true, "Please enter age"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
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
  therapistDetails: [therapistDetailSchema],
});

// "username": "lalBahadur",
// "age": 50,
// "email": "lalala@gmail.com",
// "gender": "male/female/other",
// "phoneNo": 9805883666,
// "address": "kathmandu,bashundhara",
// "role": "user",
// "userDetails": [{}],
// "therapistDetails": [
//   {
//     "speciality": "",
//     "communicationType": "",
//     "ageGroup": "",
//     "PrefferedGender": "",
//     "PrefferedCulture": ""
//   }
// ]
export const userModel = mongoose.model("User", userSchema);
