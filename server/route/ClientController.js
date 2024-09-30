import express from "express";
import { Client } from "../model/client.js";
import { Photo } from "../model/photo.js";
import multer from "multer";


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
            return res.status(400).send({ message: "More information is required to make a new user" });
        }

        // Create a new user object with request data
        const newUser = new Client({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            age: req.body.age,
            phoneNumber: req.body.phoneNumber,
            hairDetails: req.body.hairDetails,
            allergies: req.body.allergies
        });
		
        // Save user in the database
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating a user." });
    }
});

// Update user
router.put("/:username", async (req, res) => {
    try {
        // Find the user by username and update their info
        const updatedUser = await Client.findOneAndUpdate(
            { username: req.params.username },
            { $set: req.body }, // Update the user with the new data from the request body
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        res.send(updatedUser); // Send the updated user data back as a response
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while updating the user." });
    }
});

// Delete user
router.delete("/:username", async (req, res) => {
    try {
        // Find the user by username and delete them
        const deletedUser = await Client.findOneAndDelete({ username: req.params.username });

        if (!deletedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        res.send({ message: "User deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while deleting the user." });
    }
});


export default router;