import { Router } from "express";
import {
  createFeedback,
  updateFeedback,
} from "../controller/feedbackController.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJwt, createFeedback);
router.put("/:feedbackId", verifyJwt, updateFeedback);

export default router;
