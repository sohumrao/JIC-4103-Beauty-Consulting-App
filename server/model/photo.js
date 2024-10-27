import mongoose from "mongoose";

// Defining the schema for photos
const PhotoSchema = new mongoose.Schema({
	data: Buffer, // Storing the image data directly in MongoDB as a binary buffer
	contentType: String, // Storing the file's MIME type
	uploadedAt: {
		type: Date,
		default: Date.now,
	},
});

const Photo = mongoose.model("Photo", PhotoSchema);

export { Photo, PhotoSchema };
