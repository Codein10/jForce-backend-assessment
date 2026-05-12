import dotenv from "dotenv";
import express from "express";
import connectDb from "./src/db/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import adminFeedbackRoutes from "./src/routes/adminFeedbackRoutes.js";
import cors from "cors";
dotenv.config({ path: "./.env" });
const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin/feedback", adminFeedbackRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API is running" });
});

const startServer = async () => {
  try {
    await connectDb();

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    server.on("error", (error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
