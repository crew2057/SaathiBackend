import express from "express";
import {
  getTherapistDummy,
  getTherapist,
  updateTherapist,
  deleteTherapist,
} from "../controller/therapistController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/dummy", getTherapistDummy);
router.route("/").get(getTherapist);
router
  .route("/:id")
  .put(protect, updateTherapist)
  .delete(protect, deleteTherapist);

export { router };
