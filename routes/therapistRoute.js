import express from "express";
import {
  getTherapistDummy,
  getTherapist,
  updateTherapist,
  deleteTherapist,
  getAssignedUsers,
} from "../controller/therapistController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/dummy", getTherapistDummy);
router.route("/").get(getTherapist);
router.get("/users/:id", getAssignedUsers);
router
  .route("/:id")
  .put(protect, updateTherapist)
  .delete(protect, deleteTherapist);

export { router };
