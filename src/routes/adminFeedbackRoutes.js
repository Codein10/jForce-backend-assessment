import { Router } from "express";
import {
  createFeedbackByAdmin,
  deleteFeedbackByAdmin,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackByAdmin,
} from "../controller/adminFeedbackController.js";
import { verifyAdmin, verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJwt, verifyAdmin);

router.get("/", getAllFeedback);
router.get("/:feedbackId", getFeedbackById);
router.post("/", createFeedbackByAdmin);
router.put("/:feedbackId", updateFeedbackByAdmin);
router.delete("/:feedbackId", deleteFeedbackByAdmin);

export default router;
