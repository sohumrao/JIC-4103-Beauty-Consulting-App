import express from "express";
import UserDB from "../models/model.js";

const router = express.Router();

// Create new user
router.post("/", async (req, res) => {
    try {
        // Check if name and email are provided in the request body
        if (!req.body || !req.body.name || !req.body.email) {
            return res.status(400).send({ message: "More information is required to make a new user" });
        }

        // Create a new user object with request data
        const newUser = new UserDB({
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





/*
 !-- For future use  --!
*/

// Retrieve all users
router.get("/getAll", async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await UserDB.find();
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving users." });
    }
});

// Retrieve a single user by ID
router.get("/get/:id", async (req, res) => {
    try {
        // Retrieve a single user by ID
        const user = await UserDB.findById(req.params.id);
        res.send(user);
    } catch (err) {     
        res.status(500).send({ message: err.message || "Some error occurred while retrieving a user." });
    }
});

// Update a user by ID
router.put("/update/:id", async (req, res) => {
    try {
        // Update a user by ID
        const updatedUser = await UserDB.findByIdAndUpdate  (req.params.id, { 
            name: req.body.name,
            email: req.body.email
        }, { new: true });
        res.send(updatedUser);
    } catch (err) { 
        res.status(500).send({ message: err.message || "Some error occurred while updating a user." });
    }
});

// Delete a user by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        // Delete a user by ID
        await UserDB.findByIdAndDelete(req.params.id);
        res.send({ message: "User was deleted successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while deleting a user." });
    }
});


export default router;