import mongoose from "mongoose";
import { Feedback } from "../model/feedback.model.js";
import { User } from "../model/user.model.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getAllFeedback = async (_req, res) => {
  try {
    const feedbackList = await Feedback.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All feedback fetched successfully",
      feedback: feedbackList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!isValidObjectId(feedbackId)) {
      return res.status(400).json({
        message: "Invalid feedbackId",
      });
    }

    const feedback = await Feedback.findById(feedbackId).populate(
      "user",
      "username email role"
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      message: "Feedback fetched successfully",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

export const createFeedbackByAdmin = async (req, res) => {
  try {
    const { feedbackText, userId } = req.body;

    if (!feedbackText || !feedbackText.trim() || !userId) {
      return res.status(400).json({
        message: "feedbackText and userId are required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const feedback = await Feedback.create({
      feedbackText: feedbackText.trim(),
      user: userId,
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      "user",
      "username email role"
    );

    return res.status(201).json({
      message: "Feedback created successfully by admin",
      feedback: populatedFeedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating feedback",
      error: error.message,
    });
  }
};

export const updateFeedbackByAdmin = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { feedbackText, userId } = req.body;

    if (!isValidObjectId(feedbackId)) {
      return res.status(400).json({
        message: "Invalid feedbackId",
      });
    }

    if (!feedbackText || !feedbackText.trim()) {
      return res.status(400).json({
        message: "feedbackText is required",
      });
    }

    if (userId && !isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      feedback.user = userId;
    }

    feedback.feedbackText = feedbackText.trim();
    await feedback.save();

    const updatedFeedback = await Feedback.findById(feedback._id).populate(
      "user",
      "username email role"
    );

    return res.status(200).json({
      message: "Feedback updated successfully by admin",
      feedback: updatedFeedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating feedback",
      error: error.message,
    });
  }
};

export const deleteFeedbackByAdmin = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!isValidObjectId(feedbackId)) {
      return res.status(400).json({
        message: "Invalid feedbackId",
      });
    }

    const feedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      message: "Feedback deleted successfully by admin",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting feedback",
      error: error.message,
    });
  }
};
