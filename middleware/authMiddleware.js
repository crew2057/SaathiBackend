import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { userModel } from "../model/userModel.js";
import "dotenv/config.js";
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.toLocaleLowerCase().startsWith("bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id);
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized,no token");
  }
});
