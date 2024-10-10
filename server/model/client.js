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
	//TODO: refactor this with frontend
	// hairDetails: {
	//     type: { type: String, required: true },
	//     texture: { type: String, required: true },
	//     history: [TreatmentSchema],
	// },
});

const Client = Account.discriminator("Client", ClientSchema);
export { Client };
