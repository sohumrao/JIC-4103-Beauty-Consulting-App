import mongoose from "mongoose";

// Function to establish connection with MongoDB
const connectDB = async () => {
    try {
        // Attempting to connect to MongoDB using provided URI
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

export default connectDB;