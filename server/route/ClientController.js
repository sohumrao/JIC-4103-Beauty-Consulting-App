import express from "express";
import { Client } from "../model/client.js";
import { Account } from "../model/account.js";
import { Photo } from "../model/photo.js";
import multer from "multer";
import sharp from "sharp";
import heicConvert from "heic-convert";

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
router.post("/", async (req, res) => {
	try {
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
		const newUser = await Client.findOne({ username: req.body.username });
		res.send(newUser);
	} catch (err) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while creating a user.",
		});
	}
});

router.get("/:username", async (req, res) => {
	try {
		// Check for username param
		if (!req.params || !req.params.username) {
			return res.status(400).send({
				message: "More information is required to retrieve user data.",
			});
		}

		// Find user data for username
		const user = await Client.findOne({ username: req.params.username });

		// Check if user exists
		if (!user) {
			return res
				.status(404)
				.send({ message: "User has no profile data." });
		}

		// Return user data
		res.send(user);
	} catch (err) {
		res.status(500).send({
			message:
				err.message ||
				"Some error occurred while retrieving user data.",
		});
	}
});

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// POST route to handle photo upload and save data in Account's profilePhoto
router.post("/photo", upload.single("photo"), async (req, res) => {
	try {
		if (!req.file || !req.body.username) {
			return res
				.status(400)
				.send({ message: "Photo and username are required!" });
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
			.resize({ width: 400 }) // Example: resize to 800px wide
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
			return res.status(404).send({ message: "User not found." });
		}

		res.send({
			message:
				"Profile photo uploaded and updated in the Account successfully!",
			data: updatedAccount,
		});
	} catch (err) {
		res.status(500).send({
			message:
				err.message ||
				"Some error occurred while uploading the profile photo.",
		});
	}
});

// Route to retrieve profile photo by username and serve it as an image
router.get("/:username/photo", async (req, res) => {
	try {
		// Fetch the account from the database by username
		const account = await Account.findOne({
			username: req.params.username,
		});

		if (
			!account ||
			!account.profilePhoto ||
			!account.profilePhoto.photoData
		) {
			return res.status(404).send({
				message: "No profile photo found for the given username.",
			});
		}

		// Set the content type of the response to the photo's MIME type
		res.set("Content-Type", account.profilePhoto.photoContentType);

		// Send the photo binary data as the response
		res.send(account.profilePhoto.photoData);
	} catch (err) {
		res.status(500).send({
			message:
				err.message ||
				"Some error occurred while retrieving the profile photo.",
		});
	}
});

// Update user
router.put("/:username", async (req, res) => {
	try {
		// Find the user by username and update their info
		const updatedUser = await Client.findOneAndUpdate(
			{ username: req.params.username },
			//FIXME: req.body should be formatted to Client Schema
			{ $set: req.body }, // Update the user with the new data from the request body
			{ new: true } // Return the updated document
		);

		if (!updatedUser) {
			return res.status(404).send({ message: "User not found." });
		}

		// FIXME: should not send password/any other extra information
		res.send(updatedUser); // Send the updated user data back as a response
	} catch (err) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while updating the user.",
		});
	}
});

// Delete user
router.delete("/:username", async (req, res) => {
	try {
		console.log(req.params.username);
		// Find the user by username and delete them
		const deletedUser = await Client.findOneAndDelete({
			username: req.params.username,
		});

		console.log(req.params.username);
		console.log(deletedUser);

		if (!deletedUser) {
			return res.status(404).send({ message: "User not found." });
		}

		res.send({ message: "User deleted successfully." });
	} catch (err) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while deleting the user.",
		});
	}
});

export default router;
