import mongoose from "mongoose";
import crypto from "crypto";

const AccountSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	hash: String,
	salt: String,
});

AccountSchema.methods.createHashedPassword = function (password) {
	// Creating a unique salt for a particular user
	this.salt = crypto.randomBytes(16).toString("hex");

	// Hashing user's salt and password with 1000 iterations,
	// 64 length and sha512 digest
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
		.toString(`hex`);
};

AccountSchema.methods.validateHashedPassword = function (password) {
	var hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
		.toString(`hex`);
	return this.hash === hash;
};

const ResetPasswordSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	//TODO: connect tables with IDs
	username: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60, // seconds
	},
});
// Creating a model based on the user schema

const Account = mongoose.model("accounts", AccountSchema);
const ResetPassword = mongoose.model("resetpassword", ResetPasswordSchema);

export { Account, ResetPassword };
