import express from "express";
import { Account } from "../model/account.js";
import { Stylist } from "../model/stylist.js";
import { ConflictError, MalformedRequestError } from "../errors.js";
import asyncHandler from "express-async-handler";
import { param, body, validationResult } from "express-validator";

/**
 * This router handles user creation and photo upload services for the application.
 *
 * - User Creation:
 *    Allows creating a new user by sending a POST request with user details such as username, name, email,
 *    gender, birthday, phone number, hair details, and allergies.
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
					birthday: req.body.birthday,
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

router.post(
	"/service/:username", //TODO: pass user_id in JWT instead of username in url
	[
		param("username")
			.exists()
			.withMessage("Username is required in the URL")
			.notEmpty()
			.withMessage("Username cannot be empty"),
		body("name")
			.exists()
			.withMessage("Name is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Name cannot be empty"), //TODO: decide which characters are allowed
		body("price")
			.exists()
			.withMessage("Price is required")
			.isFloat({ min: 0 })
			.withMessage("Price must be a positive number")
			.custom((value) => {
				// Optional: Check if it has at most two decimal places
				return /^\d+(\.\d{1,2})?$/.test(value);
			})
			.withMessage("Price can have at most two decimal places"),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));

		// Find user data for username
		const user = await Stylist.findOne({
			username: req.params.username,
		});

		// Check if user exists
		if (!user) return next(new ConflictError("User has no profile data."));
		// Create new service
		const newService = {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description || "", // Optional description
		};

		// Add service to stylist's services
		user.business.services.push(newService);

		// Save the updated user document
		await user.save();
		const serviceWithId = user.business.services.find(
			(service) => service.name === newService.name
		);
		res.status(201).send(serviceWithId);
	})
);

router.put(
	"/service/:username", //TODO: pass user_id in JWT instead of username in url
	[
		param("username")
			.exists()
			.withMessage("Username is required in the URL")
			.notEmpty()
			.withMessage("Username cannot be empty"),
		body("_id")
			.exists()
			.withMessage("_id is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("_id cannot be empty"),
		body("name")
			.exists()
			.withMessage("Name is required")
			.trim()
			.escape()
			.notEmpty()
			.withMessage("Name cannot be empty"), //TODO: decide which characters are allowed
		body("price")
			.exists()
			.withMessage("Price is required")
			.isFloat({ min: 0 })
			.withMessage("Price must be a positive number")
			.custom((value) => {
				// Optional: Check if it has at most two decimal places
				return /^\d+(\.\d{1,2})?$/.test(value);
			})
			.withMessage("Price can have at most two decimal places"),
	],
	asyncHandler(async (req, res, next) => {
		console.log(req.body._id);
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));

		// Find user data for username
		const user = await Stylist.findOne({
			username: req.params.username,
		});

		// Check if user exists
		if (!user) return next(new ConflictError("User has no profile data."));

		// Check if service already exists
		const service = user.business.services.find(
			(service) => service._id == req.body._id
		);
		if (!service) return next(new ConflictError("Service does not exist."));

		// update the service
		service.name = req.body.name;
		service.price = req.body.price;
		service.description = req.body.description || "";

		// Save the updated user document
		await user.save();
		res.status(200).send(service);
	})
);

router.get(
	"/services/:username", //TODO: pass user_id in JWT instead of username in url
	[
		param("username")
			.exists()
			.withMessage("Username is required in the URL")
			.notEmpty()
			.withMessage("Username cannot be empty"),
	],
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return next(new MalformedRequestError(errors.array()[0].msg));

		// Find user data for username
		const user = await Stylist.findOne({
			username: req.params.username,
		});

		// Check if user exists
		if (!user) return next(new ConflictError("User has no profile data."));

		// Return user data
		res.status(200).send(user.business.services);
	})
);

export default router;
