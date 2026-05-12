import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDb;
