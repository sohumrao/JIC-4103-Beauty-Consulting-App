//standalone script to populate database with data, run with `node --env-file=config.env populateDB.js`
import connectDB from "./db/connection.js";
import { Client } from "./model/client.js";
import { Stylist } from "./model/stylist.js";
import { faker } from "@faker-js/faker";
import fs from "fs";

connectDB(process.env.MONGO_URI);

// Tuneable constants
const NUM_CLIENTS = 2;
const NUM_STYLISTS = 10;

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

const photos = {
	male: fs.readdirSync("assets/profilePhotos/male").map((file) => ({
		data: fs.readFileSync(`assets/profilePhotos/male/${file}`),
		contentType: "image/jpeg",
	})),
	female: fs.readdirSync("assets/profilePhotos/female").map((file) => ({
		data: fs.readFileSync(`assets/profilePhotos/female/${file}`),
		contentType: "image/jpeg",
	})),
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

const generatePerson = () => {
	const sex = faker.person.sex();
	const firstName = faker.person.firstName(sex);
	const lastName = faker.person.lastName();
	const fullName = firstName + " " + lastName;
	const email = faker.internet.email({ firstName, lastName });
	const username = faker.internet.username({ firstName, lastName });

	const randomIndex = Math.floor(Math.random() * photos[sex].length);
	const photo = photos[sex][randomIndex];
	return { sex, fullName, email, username, photo };
};

// Create clients
const createClients = async () => {
	const clients = [];

	for (let i = 0; i < NUM_CLIENTS; i++) {
		const { sex, fullName, email, username, photo } = generatePerson();

		const client = new Client({
			username: username,
			email: email,
			info: {
				name: fullName,
				birthday: faker.date.past(30),
				gender: sex,
				phoneNumber: faker.phone.number(),
			},
			profilePhoto: photo,
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
		const { sex, fullName, email, username, photo } = generatePerson();
		const stylist = new Stylist({
			username: username,
			email: email,
			info: {
				name: fullName,
				birthday: faker.date.birthdate(),
				gender: sex,
				phoneNumber: faker.phone.number(),
			},
			profilePhoto: photo,
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
