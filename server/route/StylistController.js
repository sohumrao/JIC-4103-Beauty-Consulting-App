import express from "express";
import { Account } from "../model/account.js";
import { Stylist } from "../model/stylist.js";
import { Photo } from "../model/photo.js";
import multer from "multer";

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
		const newUser = await Stylist.findOne({ username: req.body.username });
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
		const user = await Stylist.findOne({ username: req.params.username });

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
		return res.status(400).send({ message: "Photo and username are required!" });
	  }
  
	  let imageBuffer = req.file.buffer;
  
	  // Check if the image is in HEIC format
	  if (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif') {
		// Convert HEIC to JPEG
		const jpegBuffer = await heicConvert({
		  buffer: imageBuffer,
		  format: 'JPEG',
		  quality: 0.5
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
			photoContentType: 'image/jpeg',
			uploadedAt: new Date(),
		  }
		},
		{ new: true }
	  );
  
	  if (!updatedAccount) {
		return res.status(404).send({ message: "User not found." });
	  }
  
	  res.send({
		message: "Profile photo uploaded and updated in the Account successfully!",
		data: updatedAccount,
	  });
	} catch (err) {
	  res.status(500).send({
		message: err.message || "Some error occurred while uploading the profile photo.",
	  });
	}
  });
  

// Route to retrieve profile photo by username and serve it as an image
router.get("/:username/photo", async (req, res) => {
	try {
	  // Fetch the account from the database by username
	  const account = await Account.findOne({ username: req.params.username });
  
	  if (!account || !account.profilePhoto || !account.profilePhoto.photoData) {
		return res
		  .status(404)
		  .send({ message: "No profile photo found for the given username." });
	  }
  
	  // Set the content type of the response to the photo's MIME type
	  res.set("Content-Type", account.profilePhoto.photoContentType);
  
	  // Send the photo binary data as the response
	  res.send(account.profilePhoto.photoData);
	} catch (err) {
	  res.status(500).send({
		message: err.message || "Some error occurred while retrieving the profile photo.",
	  });
	}
  });

export default router;
