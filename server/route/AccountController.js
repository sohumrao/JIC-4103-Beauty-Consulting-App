import express from "express";
import { Account, ResetPassword } from "../model/account.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import mongoose from "mongoose";
import sharp from "sharp";
import heicConvert from "heic-convert";
import multer from "multer";

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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send(errors.array()[0].msg);
		}
		const { username, password } = req.body;

		const existingUser = await Account.findOne({ username: username });
		if (existingUser) {
			return res.status(409).send("Username already exists.");
		}

		try {
			const newAccount = new Account({ username });
			newAccount.createHashedPassword(password);
			const savedAccount = await newAccount.save();

			res.status(201).json(newAccount);
		} catch (error) {
			console.error("Error creating account:", error);
			//TODO: throw this to error catch-all middleware
			res.status(500).json({
				message: "Error creating account. Please try again.",
			});
		}
	}
);

router.post(
	"/signIn",
	[
		body("username").not().isEmpty().trim().escape(),
		body("password").not().isEmpty().trim().escape(),
	],
	async (req, res) => {
		const { username, password } = req.body;

		const account = await Account.findOne({ username });
		if (!account || !account.validateHashedPassword(password)) {
			// It is more secure to give a generic message instead of saying if username already exists
			return res
				.status(401)
				.send(
					"Account with that username and password does not exist."
				);
		}

		res.status(200).send("Signed in successfully!");
	}
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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send(errors.array()[0].msg);
		}

		//TODO: refactor Account to include email and other common account fields
		// email must be unique
		const { email } = req.body;

		let user = await Client.findOne({ email });
		if (!user) {
			user = await Stylist.findOne({ email });
			if (!user) {
				return res.status(409).send("No user with the provided email.");
			}
		}

		//create token
		const resetCode = Math.floor(Math.random() * 900000) + 100000;
		await ResetPassword.findOneAndUpdate(
			{ email: user.email, username: user.username },
			{ code: resetCode },
			{ upsert: true }
		);

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
			to: user.email,
			from: process.env.EMAIL_ADDRESS,
			subject: "Password Reset Code",
			text: `You are receiving this because you have requested a password reset.\nYour reset code is ${resetCode}.\n\nIf you did not request this, please ignore this email.`,
		};

		//TODO: handle case when email fails
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error("Error sending email:", err);
				return res
					.status(500)
					.json({ message: "Email could not be sent" });
			}
			res.status(201).json({ message: "Password reset email sent" });
		});
	}
);

router.post(
	"/verifyResetPasswordCode",
	[
		body("code")
			.exists()
			.withMessage("Code is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Code cannot be empty"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send(errors.array()[0].msg);
		}
		const { code } = req.body;

		let reset = await ResetPassword.findOne({ code });
		if (!reset) return res.status(409).send("Invalid reset code.");

		return res.status(201).send("Valid reset code.");
	}
);

router.post(
	"/resetPassword",
	[
		body("code")
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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send(errors.array()[0].msg);
		}
		const { code } = req.body;

		let reset = await ResetPassword.findOne({ code });
		if (!reset) return res.status(409).send("Invalid reset code.");

		let session;
		try {
			session = await mongoose.startSession();
			session.startTransaction();

			const account = await Account.findOne({
				username: reset.username,
			}).session(session);
			account.createHashedPassword(req.body.password);
			const savedAccount = await account.save({ session });

			await ResetPassword.deleteOne({ code: reset.code }).session(
				session
			);
			await session.commitTransaction();
			res.status(201).send("Password reset successfully.");
		} catch (error) {
			if (session) {
				await session.abortTransaction();
			}
			throw error;
		} finally {
			if (session) {
				await session.endSession();
			}
		}
	}
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
					photoData: compressedPhoto,
					photoContentType: "image/jpeg",
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

// Route to retrieve profile photo by username and serve it as an image
router.get(
	"/:username/photo",
	asyncHandler(async (req, res, next) => {
		// Fetch the account from the database by username
		const account = await Account.findOne({
			username: req.params.username,
		});

		if (
			!account ||
			!account.profilePhoto ||
			!account.profilePhoto.photoData
		) {
			return next(
				new ConflictError(
					"No profile photo found for the given username."
				)
			);
		}

		// Set the content type of the response to the photo's MIME type
		res.set("Content-Type", account.profilePhoto.photoContentType);

		// Send the photo binary data as the response
		res.send(account.profilePhoto.photoData);
	})
);

export default router;
