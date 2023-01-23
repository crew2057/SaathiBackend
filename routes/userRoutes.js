import express from "express";
import {
  getUserDummy,
  getUser,
  setUser,
  deleteUser,
  updateUser,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/dummy", getUserDummy);

router.route("/").get(protect, getUser).post(setUser);
router.route("/:id").put(protect, updateUser).delete(protect, deleteUser);
export { router };
