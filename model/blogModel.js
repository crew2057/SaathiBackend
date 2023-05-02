import mongoose from "mongoose";
const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  likes: Number,
  createdBy: String,
});

export const blogModel = mongoose.model("Blog", blogSchema);
