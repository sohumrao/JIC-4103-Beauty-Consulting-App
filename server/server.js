import express from "express";
import cors from "cors";

import connectDB from "./db/connection.js";
import stylistController from "./route/StylistController.js";
import accountController from "./route/AccountController.js";
import clientController from "./route/ClientController.js";
import appointmentController from "./route/AppointmentController.js";

import { errorHandler } from "./errors.js";

const PORT = process.env.PORT || 5050;
const app = express();

// MongoDB Connection
await connectDB(process.env.MONGO_URI);

// Middleware setup
app.use(cors());
app.use(express.json());

// Route Mounting
app.use("/client", clientController);
app.use("/stylist", stylistController);
app.use("/account", accountController);
app.use("/appointment", appointmentController);

// Throw 404 if no routes were visited
// Any forwarded errors won't visit this function this function only has 3 arguments
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// errorHandler takes 4 arguments, so this will catch all errors
app.use(errorHandler);

// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
