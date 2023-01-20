import express from "express";
import {
  getTherapistDummy,
  getTherapist,
  updateTherapist,
  deleteTherapist,
} from "../controller/therapistController.js";
const router = express.Router();

router.get("/dummy", getTherapistDummy);
router.route("/").get(getTherapist);
router.route("/:id").put(updateTherapist).delete(deleteTherapist);

export { router };
