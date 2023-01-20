import express from "express";
import {
  getUserDummy,
  getUser,
  setUser,
  deleteUser,
  updateUser,
} from "../controller/userController.js";
const router = express.Router();
router.get("/dummy", getUserDummy);
router.route("/").get(getUser).post(setUser);
router.route("/:id").put(updateUser).delete(deleteUser);
export { router };
