import asyncHandler from "express-async-handler";
import { blogModel } from "../model/blogModel.js";
import { userModel } from "../model/userModel.js";
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find();
  if (!(blogs.length > 0)) {
    res.status(204);
    res.json({ message: "No blogs Found" });
  }
  res.status(200);
  const blogWithUser = blogs.map(async (blog) => {
    return await userModel.findById(blog.createdBy);
  });

  const users = await Promise.all(blogWithUser);
  const response = blogs.map((blog, index) => {
    return { blog, user: users[index] };
  });
  res.json({
    response,
  });
});
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    res.json({
      message: "blog not found",
    });
    res.json({
      blog,
    });
  }
});
export const postBlog = asyncHandler(async (req, res) => {
  const { title, content, id } = req.body;
  const therapist = await userModel.findById(id);
  if (!therapist) {
    res.json({ message: "sorry no user found" });
  }
  if (therapist.role === "user") {
    res.status(403);
    res.json({ message: "sorry but you are not allowed to create a post " });
  }
  const blog = await blogModel.create({
    title: title,
    content: content,
    likes: 0,
    createdBy: id,
  });
  res.json({ message: "blog created" });
});
export const deleteBlog = asyncHandler(async (req, res) => {
  // const user = await blogModel.findById(req.user.id);
  // if (!user) {
  //   throw new Error("User doesnot exist ");
  // }
  // if (deleted.id.toString() !== user.id) {
  //   throw new Error("User not authorized");
  // }
  const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
  res.json({ deletedBlog, message: `blog deleted ${req.params.id}` });
});

export const updateBlog = asyncHandler(async (req, res) => {});

export const updateLikeCount = asyncHandler(async (req, res) => {
  const { type, id, user } = req.body;
  const blog = await blogModel.findById(req.body.id);
  if (!blog) {
    res.status(400);
    res.json({ message: "Blog to be updated not found" });
  }
  const liker = await userModel.findById(user);

  if (type === "increment") {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        likes: blog.likes + 1,
      },
      { new: true }
    );
    const updateUser = await userModel.findByIdAndUpdate(
      user,
      {
        likedBlogs: [...liker.likedBlogs, id],
      },
      { new: true }
    );

    res.json({ message: "Blog updated", blog: updatedBlog });
  }
  if (type === "decrement") {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        likes: blog.likes - 1,
      },
      { new: true }
    );
    const updateUser = await userModel.findByIdAndUpdate(
      user,
      {
        likedBlogs: [
          ...liker.likedBlogs.filter((blog) => {
            return blog !== id;
          }),
        ],
      },
      { new: true }
    );

    res.json({ message: "Blog updated", blog: updatedBlog });
  }
});
