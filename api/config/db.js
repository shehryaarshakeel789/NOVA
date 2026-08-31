import mongoose from "mongoose";
async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("MongoDB connected"));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;
