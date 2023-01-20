import mongoose from "mongoose";
const therapistSchema = mongoose.Schema({
  text: {
    type: String,
    required: ["please enter therapist details"],
  },
});
export default mongoose.model("therapist", therapistSchema);
