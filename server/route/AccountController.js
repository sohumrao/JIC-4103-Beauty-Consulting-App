import express from "express";
import { Account, ResetPassword } from "../model/account.js";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import mongoose from "mongoose";
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

		let user = await Client.findOne({ email });
		if (!user) {
			user = await Stylist.findOne({ email });
			if (!user) {
				return next(
					new ConflictError("No user with that email exists")
				);
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
				return next(new ServerError("Email could not be sent"));
			}
			res.status(201).json({ message: "Password reset email sent" });
		});
	})
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
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));
		const { code } = req.body;

		let reset = await ResetPassword.findOne({ code });
		if (!reset) return next(new ConflictError("Invalid reset code."));

		return res.status(201).send("Valid reset code.");
	})
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
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));
		const { code } = req.body;

		let reset = await ResetPassword.findOne({ code });
		if (!reset) return next(new ConflictError("Invalid reset code."));

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
	})
);

export default router;
