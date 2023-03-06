import express from "express";
import { collaborative } from "../controller/CollaborativeFiltering.js";
import {
  getUserDummy,
  getUser,
  setUser,
  deleteUser,
  updateUser,
  getUserByID,
  RecommendTherapist,
  getAssignedTherapist,
  AssignTherapist,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/dummy", getUserDummy);

router.get("/therapist/:id", getAssignedTherapist);
router.post("/assign", AssignTherapist);
router.get("/recommend/:id", RecommendTherapist);
router.get("/recommendByAlgo/:id", collaborative);
router.route("/").get(getUser).post(setUser);
router
  .route("/:id")
  .put(protect, updateUser)
  .delete(protect, deleteUser)
  .get(protect, getUserByID);

export { router };
