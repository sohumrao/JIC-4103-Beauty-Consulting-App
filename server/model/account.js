import mongoose from "mongoose";
import crypto from "crypto";
import { PhotoSchema } from "./photo.js";

const AccountSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String }, //TODO: refactor password to be required
	password: {
		hash: String,
		salt: String,
	},
	info: {
		name: String,
		birthday: Date,
		gender: String,
		phoneNumber: String,
	},
	profilePhoto: PhotoSchema,
	resetCode: {
		type: String,
		expires: 60 * 60, // seconds
	},
	// authToken: JWT token
});

AccountSchema.methods.createHashedPassword = function (password) {
	// Creating a unique salt for a particular user
	this.password.salt = crypto.randomBytes(16).toString("hex");

	// Hashing user's salt and password with 1000 iterations,
	// 64 length and sha512 digest
	this.password.hash = crypto
		.pbkdf2Sync(password, this.password.salt, 1000, 64, `sha512`)
		.toString(`hex`);
};

AccountSchema.methods.validateHashedPassword = function (password) {
	var hash = crypto
		.pbkdf2Sync(password, this.password.salt, 1000, 64, `sha512`)
		.toString(`hex`);
	return this.password.hash === hash;
};

const Account = mongoose.model("Account", AccountSchema);
export { Account };
