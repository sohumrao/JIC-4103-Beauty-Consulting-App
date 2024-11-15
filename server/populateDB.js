//standalone script to populate database with data, run with `node --env-file=config.env populateDB.js`
import connectDB from "./db/connection.js";
import { Client } from "./model/client.js";
import { Stylist } from "./model/stylist.js";
import { faker } from "@faker-js/faker";
import fs from "fs";

const dummyData = JSON.parse(fs.readFileSync("./assets/dummyData.json"));
const { services, concerns, allergies, additionalInfo } = dummyData;

await connectDB(process.env.MONGO_URI);

// Tuneable constants
const NUM_CLIENTS = 2;
const NUM_STYLISTS = 10;

// Helper function to generate hair details
const generateHairDetails = () => {
	// Select one random type and one random texture
	const hairTypes = [
		"Natural",
		"Relaxed",
		"Straight",
		"Wavy",
		"Curly",
		"DeepWave",
		"LooseCurl",
		"TightlyCoiled",
	];
	const hairTextures = ["Fine", "Medium", "Thick"];

	const selectedType =
		hairTypes[Math.floor(Math.random() * hairTypes.length)];
	const selectedTexture =
		hairTextures[Math.floor(Math.random() * hairTextures.length)];

	return {
		// type
		Natural: selectedType === "Natural",
		Relaxed: selectedType === "Relaxed",
		Straight: selectedType === "Straight",
		Wavy: selectedType === "Wavy",
		Curly: selectedType === "Curly",
		DeepWave: selectedType === "DeepWave",
		LooseCurl: selectedType === "LooseCurl",
		TightlyCoiled: selectedType === "TightlyCoiled",

		// texture
		Fine: selectedTexture === "Fine",
		Medium: selectedTexture === "Medium",
		Thick: selectedTexture === "Thick",
	};
};

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
			allergies: faker.helpers
				.arrayElements(allergies, {
					min: 1,
					max: 3,
				})
				.join(", "),
			additionalConcerns: faker.helpers
				.arrayElements(concerns, {
					min: 1,
					max: 3,
				})
				.join(", "),
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
		const stylistServices = faker.helpers.arrayElements(services, {
			min: 1,
			max: 3,
		});
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
				experience: faker.number.int({ min: 1, max: 10 }), // TODO: should be refactored to be a date
				specialty: stylistServices
					.map((service) => service.name)
					.join(", "),
				additionalInfo: faker.helpers
					.arrayElements(additionalInfo, {
						min: 1,
						max: 3,
					})
					.join(", "),
				workedWithHairTypes: generateHairDetails(),
				services: stylistServices,
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
