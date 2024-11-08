import mongoose from "mongoose";
import { Account } from "./account.js";

const ClientSchema = new mongoose.Schema({
	hairDetails: {
		Natural: Boolean,
		Relaxed: Boolean,
		Straight: Boolean,
		Wavy: Boolean,
		Curly: Boolean,
		DeepWave: Boolean,
		LooseCurl: Boolean,
		TightlyCoiled: Boolean,
		Fine: Boolean,
		Medium: Boolean,
		Thick: Boolean,
	},
	allergies: String,
	additionalConcerns: { type: String },
	profilePhoto: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" }, // Reference to Photo
});

const Client = Account.discriminator("Client", ClientSchema);
export { Client };
