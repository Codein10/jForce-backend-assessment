import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    feedbackText: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
