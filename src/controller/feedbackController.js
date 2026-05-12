import { Feedback } from "../model/feedback.model.js";

export const createFeedback = async (req, res) => {
  try {
    const { feedbackText } = req.body;

    if (!feedbackText || !feedbackText.trim()) {
      return res.status(400).json({
        message: "feedbackText is required",
      });
    }

    const feedback = await Feedback.create({
      feedbackText: feedbackText.trim(),
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating feedback",
      error: error.message,
    });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { feedbackText } = req.body;

    if (!feedbackText || !feedbackText.trim()) {
      return res.status(400).json({
        message: "feedbackText is required",
      });
    }

    const feedback = await Feedback.findOne({
      _id: feedbackId,
      user: req.user.userId,
    });

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found for this user",
      });
    }

    feedback.feedbackText = feedbackText.trim();
    await feedback.save();

    return res.status(200).json({
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating feedback",
      error: error.message,
    });
  }
};
