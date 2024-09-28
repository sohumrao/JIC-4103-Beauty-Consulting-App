import express from "express";
import { Account, ResetPassword } from "../model/account.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";

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
			res
				.status(500)
				.json({ message: "Error creating account. Please try again." });
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
				.send("Account with that username and password does not exist.");
		}

		res.status(200).send("Signed in successfully!");
	}
);

// router.post("/emailResetPasswordLink", async (req, res) => {
// 	console.log(req.body);
// 	const { email } = req.body;

// 	if (!email) {
// 		return res.status(400).send("Email is required");
// 	}

// 	const user = await UserDB.findOne({ email });
// 	if (!user) {
// 		return res.status(404).send("No user with the provided email.");
// 	}

// 	//TODO: what to do when user is inactive?
// 	//TODO: handle case when there already is a token

// 	//create token
// 	let resetToken = crypto.randomBytes(20).toString("hex");
// 	resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

// 	//add to database
// 	const newReset = new ResetPassword({
// 		email: user.email,
// 		token: resetToken,
// 	});

// 	// Save user in the database
// 	await newReset.save();
// 	//TODO: handle database failure

// 	//TODO: handle case when email fails
// 	// Create reset URL
// 	const resetUrl = resetToken; //TODO: deep linking

// 	//TODO: create a centralized place for dev/production environment logic
// 	// service: 'gmail',
// 	// auth: {
// 	//     user: process.env.EMAIL_ADDRESS,
// 	//     pass: process.env.EMAIL_PASSWORD
// 	// }
// 	//TODO: add local testing smtp server to npm start
// 	const email_credentials = {
// 		port: 1025,
// 	};

// 	const transporter = nodemailer.createTransport(email_credentials);

// 	const mailOptions = {
// 		to: user.email,
// 		from: process.env.EMAIL_ADDRESS,
// 		subject: "Password Reset Request",
// 		text: `You are receiving this because you have requested a password reset. Please click on the following link, or paste it into your browser to complete the process: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email.`,
// 	};

// 	transporter.sendMail(mailOptions, (err, info) => {
// 		if (err) {
// 			console.error("Error sending email:", err);
// 			return res.status(500).json({ message: "Email could not be sent" });
// 		}
// 		res.status(201).json({ message: "Password reset email sent" });
// 	});
// });

export default router;
