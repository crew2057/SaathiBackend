import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  deleteBlog,
  getAllBlogs,
  getBlogById,
  postBlog,
  updateBlog,
  updateLikeCount,
} from "../controller/Blog.js";
const router = express.Router();

router.route("/").get(getAllBlogs).post(postBlog);
router.get("/:id", getBlogById);
router.put("/likes/", updateLikeCount);
router.route("/:id").put(protect, updateBlog).delete(protect, deleteBlog);

export { router };
