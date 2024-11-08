import express from "express";
import multer from "multer";
import Photo from "../model/photo.js";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import asyncHandler from "express-async-handler";
import { ConflictError, MalformedRequestError } from "../errors.js";
import mongoose from "mongoose";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to upload profile photo
router.post(
	"/photo",
	upload.single("photo"),
	asyncHandler(async (req, res, next) => {
		const { username } = req.body;

		if (!username || !req.file) {
			return next(
				new MalformedRequestError(
					"Username and photo file must be provided."
				)
			);
		}

		// Determine if the user is a Client or Stylist
		let user = await Client.findOne({ username });
		let role = "client";

		if (!user) {
			user = await Stylist.findOne({ username });
			role = "stylist";
		}

		if (!user) {
			return next(
				new ConflictError(`User with username ${username} not found.`)
			);
		}

		// Create a new Photo document
		const newPhoto = new Photo({
			data: req.file.buffer,
			contentType: req.file.mimetype,
		});

		const savedPhoto = await newPhoto.save();

		// Update user's profilePhoto reference
		if (role === "client") {
			user.profilePhoto = savedPhoto._id;
		} else {
			user.business.profilePhoto = savedPhoto._id;
		}

		await user.save();

		res.status(201).json({
			message: "Profile photo uploaded successfully.",
			photoId: savedPhoto._id,
		});
	})
);

// Endpoint to get profile photo by username
router.get(
	"/:username/photo",
	asyncHandler(async (req, res, next) => {
		const { username } = req.params;

		// Determine if the user is a Client or Stylist
		let user = await Client.findOne({ username }).populate("profilePhoto");
		let role = "client";

		if (!user) {
			user = await Stylist.findOne({ username }).populate(
				"business.profilePhoto"
			);
			role = "stylist";
		}

		if (!user) {
			return next(
				new ConflictError(`User with username ${username} not found.`)
			);
		}

		let photo = null;
		if (role === "client") {
			photo = user.profilePhoto;
		} else {
			photo = user.business.profilePhoto;
		}

		if (!photo) {
			return next(
				new ConflictError(
					`No profile photo found for user with username ${username}.`
				)
			);
		}

		res.set("Content-Type", photo.contentType);
		res.send(photo.data);
	})
);

export default router;
