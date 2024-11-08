//standalone script to populate database with data, run with `node --env-file=config.env populateDB.js`
import connectDB from "./db/connection.js";
import { Client } from "./model/client.js";
import { Stylist } from "./model/stylist.js";
import { faker } from "@faker-js/faker";
import fs from "fs";

connectDB(process.env.MONGO_URI);

// Tuneable constants
const NUM_CLIENTS = 10;
const NUM_STYLISTS = 50;

// Helper function to generate random boolean
const randomBoolean = () => Math.random() < 0.5;

// Helper function to generate hair details
const generateHairDetails = () => ({
	Natural: randomBoolean(),
	Relaxed: randomBoolean(),
	Straight: randomBoolean(),
	Wavy: randomBoolean(),
	Curly: randomBoolean(),
	DeepWave: randomBoolean(),
	LooseCurl: randomBoolean(),
	TightlyCoiled: randomBoolean(),
	Fine: randomBoolean(),
	Medium: randomBoolean(),
	Thick: randomBoolean(),
});

const randomPhoto = () => {
	// get a random photo from assets/profilePhotos
	const photos = fs.readdirSync("assets/profilePhotos");
	const randomIndex = Math.floor(Math.random() * photos.length);
	const photo = photos[randomIndex];

	// format into photoSchema
	return {
		data: fs.readFileSync(`assets/profilePhotos/${photo}`),
		contentType: "image/jpeg",
	};
};
// Helper function to generate services
const generateServices = () => {
	const services = [];
	const numServices = Math.floor(Math.random() * 5) + 1; // 1-5 services

	for (let i = 0; i < numServices; i++) {
		services.push({
			name: faker.commerce.productName(),
			price: parseFloat(faker.commerce.price(30, 300)),
			description: faker.lorem.sentence(),
		});
	}
	return services;
};

// Create clients
const createClients = async () => {
	const clients = [];

	for (let i = 0; i < NUM_CLIENTS; i++) {
		const client = new Client({
			username: faker.internet.username(),
			email: faker.internet.email(),
			info: {
				name: faker.person.fullName(),
				birthday: faker.date.past(30),
				gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
				phoneNumber: faker.phone.number(),
			},
			profilePhoto: randomPhoto(),
			hairDetails: generateHairDetails(),
			allergies: faker.food.ingredient(),
			additionalConcerns: faker.lorem.sentence(),
		});

		client.createHashedPassword("password");
		clients.push(client);
	}

	return Client.insertMany(clients);
};

// Create stylists
const createStylists = async () => {
	const stylists = [];

	for (let i = 0; i < NUM_STYLISTS; i++) {
		const stylist = new Stylist({
			username: faker.internet.username(),
			email: faker.internet.email(),
			info: {
				name: faker.person.fullName(),
				birthday: faker.date.birthdate(),
				gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
				phoneNumber: faker.phone.number(),
			},
			profilePhoto: randomPhoto(),
			business: {
				name: faker.company.name(),
				address: faker.location.streetAddress(),
				city: faker.helpers.arrayElement([
					"Atlanta",
					"New York",
					"Los Angeles",
				]),
				experience: faker.lorem.sentence(),
				specialty: faker.lorem.sentence(),
				additionalInfo: faker.lorem.paragraph(),
				workedWithHairTypes: generateHairDetails(),
				services: generateServices(),
			},
		});

		stylist.createHashedPassword("password");
		stylists.push(stylist);
	}

	return Stylist.insertMany(stylists);
};

// Main function to populate database
const populateDatabase = async () => {
	try {
		// Clear existing data
		await Promise.all([Client.deleteMany({}), Stylist.deleteMany({})]);

		// Create new data
		const clients = await createClients();
		const stylists = await createStylists();

		console.log(`Successfully created ${clients.length} clients`);
		console.log(`Successfully created ${stylists.length} stylists`);
	} catch (error) {
		console.error("Error populating database:", error);
	}
	process.exit();
};

// Run the population script
populateDatabase();
