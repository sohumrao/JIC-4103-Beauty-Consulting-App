import mongoose from "mongoose";
import { Account } from "./account.js";

const StylistSchema = new mongoose.Schema({
	business: {
		name: String,
		address: String,
		experience: String,
		specialty: String,
		additionalInfo: String,
		workedWithHairTypes: {
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
		// TODO: refactor Business Schema
		// hours: { type: HoursSchema, required: true },
		// services: [ ServiceSchema],
		// gallery: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
	},
});

const Stylist = Account.discriminator("Stylist", StylistSchema);
export { Stylist };
