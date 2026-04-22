import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in your environment variables");
}

// Optional: cache connection (useful for serverless / Next.js)
let cached = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "fullstack-ems", // change this
    })
    .then((mongooseInstance) => {
      console.log("MongoDB connected");
      return mongooseInstance;
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// store in global (important for hot reload in dev)
global.mongoose = cached;

export default connectDB;