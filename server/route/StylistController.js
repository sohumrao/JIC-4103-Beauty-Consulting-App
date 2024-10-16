import express from "express";
import { Account } from "../model/account.js";
import { Stylist } from "../model/stylist.js";
import { Photo } from "../model/photo.js";
import multer from "multer";
import { ConflictError, MalformedRequestError } from "../errors.js";
import asyncHandler from "express-async-handler";
/**
 * This router handles user creation and photo upload services for the application.
 *
 * - User Creation:
 *    Allows creating a new user by sending a POST request with user details such as username, name, email,
 *    gender, age, phone number, hair details, and allergies.
 *
 * - Photo Upload:
 *    Provides functionality to upload a user's photo and store it as binary data in MongoDB,
 *    as well as retrieving the photo by username.
 *
 * - Key Features:
 *    - Utilizes Multer middleware for handling file uploads in memory.
 *    - Allows storing and retrieving photos in MongoDB using binary data.
 *    - Ensures basic validation for user creation and photo upload requests.
 *
 * Dependencies:
 *    - Multer: For file handling.
 *    - Mongoose Models: Stylist and Photo schemas for database interaction.
 */

const router = express.Router();

// Create new user
router.post(
	"/",
	asyncHandler(async (req, res, next) => {
		// Check if name and email are provided in the request body
		if (!req.body || !req.body.name || !req.body.email) {
			next(new MalformedRequestError("Name and email are required"));
		}

		const oldUser = await Account.findOneAndUpdate(
			{ username: req.body.username },
			{
				email: req.body.email,
				info: {
					name: req.body.name,
					age: req.body.age,
					gender: req.body.gender,
					phoneNumber: req.body.phoneNumber,
					//NOTE: current code forclient HTTP request does not send zipcode
				},
				business: req.body.business,
				/* -------------------------------------------------------------------------- */
				//needed to cast User into Stylist, can be removed after refactoring one-step account creation
				__t: "Stylist",
			},
			{ overwriteDiscriminatorKey: true, new: true }
			/* -------------------------------------------------------------------------- */
		);
		// TODO: don't return user data, should just send 201 ok
		const newUser = await Stylist.findOne({
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

		// Find user data for username
		const user = await Stylist.findOne({
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

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// POST route to handle photo upload and save data in MongoDB
router.post(
	"/photo",
	upload.single("photo"),
	asyncHandler(async (req, res, next) => {
		// Check if the file and username are provided
		if (!req.file || !req.body.username) {
			return next(
				new MalformedRequestError("Photo and username are required!")
			);
		}

		// Create a new photo object with binary data and MIME type
		const newPhoto = new Photo({
			username: req.body.username,
			photoData: req.file.buffer, // Store the binary data
			photoContentType: req.file.mimetype, // Store the file's MIME type
		});

		// Save the photo in the database
		const savedPhoto = await newPhoto.save();
		res.send({
			message: "Photo uploaded and saved in MongoDB successfully!",
			data: savedPhoto,
		});
	})
);

// Route to retrieve photo by username and serve it as an image
router.get(
	"/:username/photo",
	asyncHandler(async (req, res, next) => {
		// Fetch the photo from the database by username
		const photo = await Photo.findOne({
			username: req.params.username,
		});

		if (!photo) {
			return res.status(404).send({
				message: "No photo found for the given username.",
			});
		}

		// Set the content type of the response to the photo's MIME type
		res.set("Content-Type", photo.photoContentType);

		// Send the photo binary data as the response
		res.send(photo.photoData);
	})
);

export default router;
