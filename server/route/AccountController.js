import express from "express";
import { Account } from "../model/account.js";
import Appointment from "../model/appointment.js";
import { Message } from "../model/message.js";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import sharp from "sharp";
import heicConvert from "heic-convert";
import multer from "multer";

import {
	ConflictError,
	MalformedRequestError,
	UnauthorizedError,
} from "../errors.js";
import asyncHandler from "express-async-handler";
/**
 * This router handles...
 *
 *
 * Dependencies:
 *    - Mongoose Models: Client and Photo schemas for database interaction.
 */
const router = express.Router();
//TODO: figure out how to stop validation on first fail
router.post(
	"/createAccount",
	[
		body("username")
			.exists()
			.withMessage("Username is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Username cannot be empty"), //TODO: decide which characters are allowed
		body("password")
			.exists()
			.withMessage("Password is required")
			.notEmpty()
			.withMessage("Password cannot be empty"),
		// .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));
		const { username, password } = req.body;

		const existingUser = await Account.findOne({ username: username });
		if (existingUser) {
			return next(new ConflictError("Username already exists"));
		}

		const newAccount = new Account({ username });
		newAccount.createHashedPassword(password);
		const savedAccount = await newAccount.save();

		res.status(201).json(newAccount);
	})
);

router.post(
	"/signIn",
	[
		body("username").not().isEmpty().trim().escape(),
		body("password").not().isEmpty().trim().escape(),
	],
	asyncHandler(async (req, res, next) => {
		const { username, password } = req.body;

		const account = await Account.findOne({ username });
		if (!account || !account.validateHashedPassword(password)) {
			// It is more secure to give a generic message instead of saying if username already exists
			return next(
				new UnauthorizedError(
					"Account with that username and password does not exist."
				)
			);
		}

		res.status(200).send("Signed in successfully!");
	})
);

router.post(
	"/emailResetPasswordCode",
	[
		body("email")
			.exists()
			.withMessage("Email is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Email cannot be empty")
			.isEmail()
			.withMessage("Email is not valid"),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));

		//TODO: refactor Account to include email and other common account fields
		// email must be unique
		const { email } = req.body;

		let account = await Account.findOne({ email });
		if (!account)
			return next(new ConflictError("No user with that email exists"));

		let resetCode = Math.floor(Math.random() * 900000) + 100000;
		while (await Account.findOne({ resetCode }))
			resetCode = Math.floor(Math.random() * 900000) + 100000;

		account.resetCode = resetCode;
		await account.save();

		//TODO: create a centralized place for dev/production environment logic
		// service: 'gmail',
		// auth: {
		//     user: process.env.EMAIL_ADDRESS,
		//     pass: process.env.EMAIL_PASSWORD
		// }
		//TODO: add local testing smtp server to npm start
		const email_credentials = {
			port: 1025,
		};

		const transporter = nodemailer.createTransport(email_credentials);

		const mailOptions = {
			to: account.email,
			from: process.env.EMAIL_ADDRESS,
			subject: "Password Reset Code",
			text: `You are receiving this because you have requested a password reset.\nYour reset code is ${resetCode}.\n\nIf you did not request this, please ignore this email.`,
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				return next(new ServerError("Email could not be sent"));
			}
			res.status(201).json({ message: "Password reset email sent" });
		});
	})
);

router.post(
	"/verifyResetPasswordCode",
	[
		body("resetCode")
			.exists()
			.withMessage("Code is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Code cannot be empty"),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));
		const { resetCode } = req.body;

		let reset = await Account.findOne({ resetCode });
		if (!reset) return next(new ConflictError("Invalid reset code."));

		return res.status(201).send("Valid reset code.");
	})
);

router.post(
	"/resetPassword",
	[
		body("resetCode")
			.exists()
			.withMessage("Code is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Code cannot be empty"),
		//TODO: store common validation logic in one place
		body("password")
			.exists()
			.withMessage("Password is required")
			.notEmpty()
			.withMessage("Password cannot be empty"),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));
		const { resetCode } = req.body;

		let reset = await Account.findOne({ resetCode });
		if (!reset) return next(new ConflictError("Invalid reset code."));

		const account = await Account.findOne({
			username: reset.username,
		});

		account.createHashedPassword(req.body.password);
		account.resetCode = null;
		const savedAccount = await account.save();
		res.status(201).send("Password reset successfully.");
	})
);

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// POST route to handle photo upload and save data in Account's profilePhoto
router.post(
	"/photo",
	upload.single("photo"),
	asyncHandler(async (req, res, next) => {
		if (!req.file || !req.body.username) {
			return next(
				new MalformedRequestError("Photo and username are required!")
			);
		}

		let imageBuffer = req.file.buffer;

		// Check if the image is in HEIC format
		if (
			req.file.mimetype === "image/heic" ||
			req.file.mimetype === "image/heif"
		) {
			// Convert HEIC to JPEG
			const jpegBuffer = await heicConvert({
				buffer: imageBuffer,
				format: "JPEG",
				quality: 0.5,
			});
			imageBuffer = jpegBuffer;
		}

		// Compress the image using sharp
		const compressedPhoto = await sharp(imageBuffer)
			.resize({ width: 400 }) // Example: resize to 400px wide
			.jpeg({ quality: 50 }) // Adjust compression level
			.toBuffer();

		// Update the profilePhoto field in the Account schema
		const updatedAccount = await Account.findOneAndUpdate(
			{ username: req.body.username },
			{
				profilePhoto: {
					data: compressedPhoto,
					contentType: "image/jpeg",
					uploadedAt: new Date(),
				},
			},
			{ new: true }
		);

		if (!updatedAccount) {
			return next(new ConflictError("User not found."));
		}

		res.send({
			message: "Profile photo uploaded and updated successfully!",
			data: updatedAccount,
		});
	})
);

// Delete user
router.delete(
	"/:username",
	asyncHandler(async (req, res, next) => {
		console.log(req.params.username);
		// Find the user by username and delete them
		const deletedUser = await Account.findOneAndDelete({
			username: req.params.username,
		});

		console.log(req.params.username);
		console.log(deletedUser);

		if (!deletedUser) {
			return next(new ConflictError("User not found."));
		}
		// Delete associated appointments and messages
		await Promise.all([
			Appointment.deleteMany({
				$or: [
					{ client: deletedUser._id },
					{ stylist: deletedUser._id },
				],
			}),
			Message.deleteMany({
				$or: [
					{ clientUsername: deletedUser.username },
					{ StylistUsername: deletedUser.username },
				],
			}),
		]);
		res.send({ message: "User deleted successfully." });
	})
);

// Route to retrieve profile photo by username and serve it as an image
router.get(
	"/:username/photo",
	asyncHandler(async (req, res, next) => {
		// Fetch the account from the database by username
		const account = await Account.findOne({
			username: req.params.username,
		});

		if (!account || !account.profilePhoto || !account.profilePhoto.data) {
			return next(
				new ConflictError(
					"No profile photo found for the given username."
				)
			);
		}

		// Set the content type of the response to the photo's MIME type
		res.set("Content-Type", account.profilePhoto.contentType);

		// Send the photo binary data as the response
		res.send(account.profilePhoto.data);
	})
);

export default router;
