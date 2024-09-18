import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./db/connection.js";
import stylistController from "./route/StylistController.js";
import accountController from "./route/AccountController.js";
import clientController from "./route/ClientController.js";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware setup
connectDB();
app.use(cors());
app.use(express.json());

// Route Mounting
app.use("/client", clientController);
app.use("/stylist", stylistController);
app.use("/account", accountController);

// MongoDB Connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connection is open');
});


// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});