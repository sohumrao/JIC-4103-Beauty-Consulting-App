import mongoose from "mongoose";

const connectDB = async (uri) => {
	try {
		// Connecting to MongoDB using provided URI without deprecated options
		await mongoose.connect(uri);
		console.log("MongoDB connected");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1); // Exit process with failure
	}
};

export default connectDB;
