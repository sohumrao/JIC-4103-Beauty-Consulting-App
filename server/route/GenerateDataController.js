import express from "express";
import { Stylist } from "../model/stylist.js"; // Adjust the import path as needed
import asyncHandler from "express-async-handler";

const router = express.Router();

// List of sample cities
const cities = ["Atlanta", "New York", "Los Angeles"];

// Hair types that a stylist might work with
const hairTypes = [
	"Natural",
	"Relaxed",
	"Straight",
	"Wavy",
	"Curly",
	"DeepWave",
	"LooseCurl",
	"TightlyCoiled",
	"Fine",
	"Medium",
	"Thick",
];

// Helper function to generate random hair type preferences
function getRandomHairTypes() {
	const workedWithHairTypes = {};
	hairTypes.forEach((type) => {
		workedWithHairTypes[type] = Math.random() < 0.5; // Randomly assign true or false
	});
	return workedWithHairTypes;
}

// Helper function to generate a random city
function getRandomCity() {
	return cities[Math.floor(Math.random() * cities.length)];
}

// Route to auto-generate 20 stylist accounts
router.post(
	"/autogenerate-stylists",
	asyncHandler(async (req, res, next) => {
		const stylistPromises = [];

		for (let i = 0; i < 20; i++) {
			const city = getRandomCity(); // Generate the city once to use in both info and business
			const stylistData = {
				username: Array(10)
					.fill(null)
					.map(() => Math.random().toString(36)[2])
					.join(""),
				email: `${Array(10)
					.fill(null)
					.map(() => Math.random().toString(36)[2])
					.join("")}@example.com`,
				info: {
					name: `Stylist ${i + 1}`,
					birthday: new Date(
						Math.floor(Math.random() * 13) + 1980,
						Math.floor(Math.random() * 12),
						Math.floor(Math.random() * 28) + 1
					), // Random birth date between 1980 and 1993
					gender: Math.random() < 0.5 ? "male" : "female",
					phoneNumber: `123-456-78${i}`,
				},
				business: {
					name: `Salon ${i + 1}`,
					address: `Address ${i + 1}`,
					experience: `${Math.floor(Math.random() * 15) + 1} years`,
					specialty: "General Hair Care",
					additionalInfo: "Expert in various hair styles.",
					city: city, // Set the same city in the business section for consistency
					workedWithHairTypes: getRandomHairTypes(),
				},
			};

			const stylist = new Stylist(stylistData);
			stylistPromises.push(stylist.save());
		}

		try {
			await Promise.all(stylistPromises);
			res.status(201).send({
				message: "20 stylists created successfully!",
			});
		} catch (err) {
			next(err); // Handle error using error-handling middleware
		}
	})
);

export default router;
