import express from "express";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./db/connection.js";

import stylistController from "./route/StylistController.js";
import accountController from "./route/AccountController.js";
import clientController from "./route/ClientController.js";
import createDataController from "./route/GenerateDataController.js";
import appointmentController from "./route/AppointmentController.js";
import messagingController, {
	setUpWebSocketServer,
} from "./route/MessagingController.js"; // Import the WebSocket setup

import { errorHandler } from "./errors.js";

const PORT = process.env.PORT || 5050;
const app = express();
const httpServer = createServer(app);

// MongoDB Connection
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Route Mounting
app.use("/client", clientController);
app.use("/stylist", stylistController);
app.use("/account", accountController);
app.use("/create-data", createDataController);
app.use("/appointment", appointmentController);
app.use("/messages", messagingController);

// Set up WebSocket server
setUpWebSocketServer(httpServer); // Moved WebSocket logic into the controller

// Throw 404 if no routes were visited
app.use(function (req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error handler
app.use(errorHandler);

// Start the server using httpServer (not app)
httpServer.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
