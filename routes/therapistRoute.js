import express from "express";
import {
  getTherapistDummy,
  getTherapist,
  setTherapist,
  updateTherapist,
  deleteTherapist,
} from "../controller/therapistController.js";
const router = express.Router();

router.get("/dummy", getTherapistDummy);
router.route("/").get(getTherapist).post(setTherapist);

router.route("/:id").put(updateTherapist).delete(deleteTherapist);

export { router };
