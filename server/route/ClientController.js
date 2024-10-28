import express from "express";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import { Account } from "../model/account.js";
import { ConflictError, MalformedRequestError } from "../errors.js";
import asyncHandler from "express-async-handler";
import { getCoordsOfLocation, haversineDistance } from "../geocodingBackend.js";
/**
 * This router handles user creation, updating, deletion, and photo upload services for the application.
 *
 * - User Creation:
 *    Allows creating a new user by sending a POST request with user details such as username, name, email,
 *    gender, birthday, phone number, hair details, and allergies.
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
					birthday: req.body.birthday,
					// city: req.body.city,
					gender: req.body.gender,
					phoneNumber: req.body.phoneNumber,
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

// Route to match stylists based on client's hair details and city
router.post(
	"/matchStylists/:username",
	asyncHandler(async (req, res, next) => {
		const username = req.body.username;
		console.log(username);
		const distanceToSearch = req.body.distance;

		// Step 1: Retrieve client details based on username
		const client = await Client.findOne({ username });

		if (!client) {
			return next(new ConflictError("Client not found."));
		}

		// Step 2: Extract client's hair details
		const clientHairDetails = client.hairDetails;

		// Step 3: Determine city based on request body or client info
		const city = req.body.city;
		const cityToUse = city.trim();
		console.log(cityToUse);
		const clientCoords = await getCoordsOfLocation(cityToUse);
		if (!clientCoords[0]) {
			return next(new ConflictError("Error with Client Location."));
		}
		const clientLat = clientCoords[1];
		const clientLong = clientCoords[2];

		if (!cityToUse) {
			return next(
				new MalformedRequestError(
					"City is not specified in the request body or client profile."
				)
			);
		}

		const allStylists = await Stylist.find();
		let stylistsInCity = [];

		// Step 4: big loop to determine eligible stylists
		for (const stylist of allStylists) {
			console.log("next stylist");
			if (!stylist.business.city) {
				continue;
			}
			const stylistCity = stylist.business.city.trim();
			// case 1: stylists city directly matches client city
			// lazily won't do lookup in this case
			if (stylistCity.localeCompare(cityToUse)) {
				stylistsInCity.push(stylist);
				continue;
			}
			// case 2: actually have to do some work
			// TODO make this use more specific address once we enforce
			// that the fields don't just say "address 2"

			const stylistCoords = await getCoordsOfLocation(stylistCity);
			if (!stylistCoords[0]) {
				continue;
			}
			const stylistLat = stylistCoords[1];
			const stylistLong = stylistCoords[2];

			const distance = haversineDistance(
				clientLat,
				clientLong,
				stylistLat,
				stylistLong
			);
			if (distance < distanceToSearch) {
				stylistsInCity.push(stylist);
			}
		}

		console.log(stylistsInCity.length);

		// Check if there are no stylists in the specified city
		if (!stylistsInCity || stylistsInCity.length === 0) {
			return next(
				new ConflictError(`No stylists found in ${cityToUse}.`)
			);
		}

		// Step 5: Calculate similarity score based on hair types and prepare response
		const stylistsWithDetails = stylistsInCity.map((stylist) => {
			let matchScore = 0;
			let matchingHairDetails = {};

			// Compare each hair type between client and stylist
			Object.keys(clientHairDetails).forEach((key) => {
				if (
					clientHairDetails[key] &&
					stylist.business.workedWithHairTypes[key]
				) {
					matchScore++;
					matchingHairDetails[key] = true;
				}
			});

			// Filter to only include hair details that are true
			const filteredHairDetails = Object.keys(matchingHairDetails)
				.filter((key) => matchingHairDetails[key])
				.reduce((obj, key) => {
					obj[key] = true;
					return obj;
				}, {});

			// Find the profile picture if available
			const profilePicture = stylist.profilePhoto
				? stylist.profilePhoto
				: null;

			// Return stylist information including name, business name, and address
			return {
				username: stylist.username,
				name: stylist.info.name, // Stylist's name
				businessName: stylist.business.name, // Business name
				businessAddress: stylist.business.address, // Business address
				mostSimilarHairDetails: filteredHairDetails,
				profilePicture: profilePicture,
				matchScore: matchScore,
			};
		});

		// Step 6: Sort by similarity score in descending order
		const sortedStylists = stylistsWithDetails
			.sort((a, b) => b.matchScore - a.matchScore)
			.map((item) => ({
				username: item.username,
				name: item.name,
				businessName: item.businessName,
				businessAddress: item.businessAddress,
				mostSimilarHairDetails: item.mostSimilarHairDetails,
				profilePicture: item.profilePicture,
			}));

		// Send formatted stylists as response
		res.send(sortedStylists);
	})
);

export default router;
