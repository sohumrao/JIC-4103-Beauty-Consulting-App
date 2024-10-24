import mongoose from "mongoose";
import crypto from "crypto";
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String },
	//TODO: refactor password to be required
	password: {
		hash: String,
		salt: String,
	},
	info: {
		name: String,
		age: Number,
		gender: String,
		zipcode: String,
		phoneNumber: String,
		city: String,
	},
	profilePhoto: {
		photoData: {
			type: Buffer, // Storing the image data directly in MongoDB as a binary buffer
			required: false,
		},
		photoContentType: {
			type: String, // Storing the file's MIME type
			required: false,
		},
		uploadedAt: {
			type: Date,
			default: Date.now,
		},
	},
	// authToken: JWT token
	// resetToken: JWT token
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

const Account = mongoose.model("Account", AccountSchema);
const ResetPassword = mongoose.model("resetpassword", ResetPasswordSchema);

export { Account, ResetPassword };
