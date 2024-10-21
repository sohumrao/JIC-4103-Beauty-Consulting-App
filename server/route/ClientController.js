import express from "express";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import { Account } from "../model/account.js";
import { ConflictError, MalformedRequestError } from "../errors.js";
import asyncHandler from "express-async-handler";

/**
 * This router handles user creation, updating, deletion, and photo upload services for the application.
 *
 * - User Creation:
 *    Allows creating a new user by sending a POST request with user details such as username, name, email,
 *    gender, age, phone number, hair details, and allergies.
 *
 * - User Update:
 *    Allows updating an existing user's information by sending a PUT request with updated user details
 *    based on the username parameter in the URL.
 *
 * - User Deletion:
 *    Allows deleting an existing user by sending a DELETE request with the username as a parameter in the URL.
 *
 * - Photo Upload:
 *    Provides functionality to upload a user's photo and store it as binary data in MongoDB,
 *    as well as retrieving the photo by username.
 *
 * - Key Features:
 *    - Utilizes Multer middleware for handling file uploads in memory.
 *    - Allows storing and retrieving photos in MongoDB using binary data.
 *    - Ensures basic validation for user creation, update, deletion, and photo upload requests.
 *
 * Dependencies:
 *    - Multer: For file handling.
 *    - Mongoose Models: Client and Photo schemas for database interaction.
 */

const router = express.Router();

// Create new user
router.post(
	"/",
	asyncHandler(async (req, res, next) => {
		// Check if name and email are provided in the request body
		if (!req.body || !req.body.name || !req.body.email) {
			return res.status(400).send({
				message: "More information is required to make a new user",
			});
		}

		const oldUser = await Account.findOneAndUpdate(
			{ username: req.body.username },
			{
				email: req.body.email,
				info: {
					name: req.body.name,
					age: req.body.age,
					// city: req.body.city,
					gender: req.body.gender,
					phoneNumber: req.body.phoneNumber,
					//NOTE: current code forclient HTTP request does not send zipcode
				},
				hairDetails: req.body.hairDetails,
				allergies: req.body.allergies,
				/* -------------------------------------------------------------------------- */
				//needed to cast User into Stylist, can be removed after refactoring one-step account creation
				__t: "Client",
			},
			{ overwriteDiscriminatorKey: true, new: true }
			/* -------------------------------------------------------------------------- */
		);
		// TODO: don't return user data, should just send 201 ok
		const newUser = await Client.findOne({
			username: req.body.username,
		});
		res.send(newUser);
	})
);

router.get(
	"/:username",
	asyncHandler(async (req, res, next) => {
		// Check for username param
		if (!req.params || !req.params.username) {
			return next(
				new MalformedRequestError(
					"More information is required to retrieve user data."
				)
			);
		}

		// Find user data for usernameg
		const user = await Client.findOne({
			username: req.params.username,
		});

		// Check if user exists
		if (!user) {
			return next(new ConflictError("User has no profile data."));
		}

		// Return user data
		res.send(user);
	})
);

// Update user
router.put(
	"/:username",
	asyncHandler(async (req, res, next) => {
		// Find the user by username and update their info
		const updatedUser = await Client.findOneAndUpdate(
			{ username: req.params.username },
			//FIXME: req.body should be formatted to Client Schema
			{ $set: req.body }, // Update the user with the new data from the request body
			{ new: true } // Return the updated document
		);

		if (!updatedUser) {
			return next(new ConflictError("User not found."));
		}

		// FIXME: should not send password/any other extra information
		res.send(updatedUser); // Send the updated user data back as a response
	})
);

// Delete user
router.delete(
	"/:username",
	asyncHandler(async (req, res, next) => {
		console.log(req.params.username);
		// Find the user by username and delete them
		const deletedUser = await Client.findOneAndDelete({
			username: req.params.username,
		});

		console.log(req.params.username);
		console.log(deletedUser);

		if (!deletedUser) {
			return next(new ConflictError("User not found."));
		}

		res.send({ message: "User deleted successfully." });
	})
);

export default router;
