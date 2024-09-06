import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    photoData: {
        type: Buffer, // Storing the image data directly in MongoDB as a binary buffer
        required: true
    },
    photoContentType: {
        type: String, // Storing the file's MIME type
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const PhotoDB = mongoose.model('PhotoDB', PhotoSchema);

export { PhotoDB };
