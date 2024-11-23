import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
	clientUsername: { type: String, required: true },
	stylistUsername: { type: String, required: true },
	sender: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

export { MessageSchema, Message };
