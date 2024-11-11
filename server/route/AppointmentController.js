import express from "express";
import Appointment from "../model/appointment.js";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import asyncHandler from "express-async-handler";
import { ConflictError, MalformedRequestError } from "../errors.js";
import mongoose from "mongoose";

const router = express.Router();

// Endpoint to create an appointment
router.post(
	"/create",
	asyncHandler(async (req, res, next) => {
		const {
			clientUsername,
			stylistUsername,
			appointmentDate,
			duration,
			notes,
		} = req.body;

		if (
			!clientUsername ||
			!stylistUsername ||
			!appointmentDate ||
			!duration
		) {
			return next(
				new MalformedRequestError(
					"All required fields (clientUsername, stylistUsername, appointmentDate, and duration) must be provided."
				)
			);
		}

		// Check if client and stylist exist
		const client = await Client.findOne({ username: clientUsername });
		const stylist = await Stylist.findOne({ username: stylistUsername });

		if (!client) {
			return next(
				new ConflictError(
					`Client with username ${clientUsername} not found.`
				)
			);
		}

		if (!stylist) {
			return next(
				new ConflictError(
					`Stylist with username ${stylistUsername} not found.`
				)
			);
		}

		// Create a new appointment
		const newAppointment = new Appointment({
			clientUsername,
			stylistUsername,
			appointmentDate,
			duration,
			notes,
		});

		const savedAppointment = await newAppointment.save();
		res.status(201).json(savedAppointment);
	})
);

// Endpoint to get appointments for clients/stylists
router.get(
	"/scheduled",
	asyncHandler(async (req, res, next) => {
		console.log(req.query);
		const { username } = req.query;
		const client = await Client.findOne({ username });
		const stylist = await Stylist.findOne({ username });

		let appointments;

		if (client) {
			appointments = await Appointment.find({
				clientUsername: username,
				status: "Scheduled",
			});
		} else if (stylist) {
			appointments = await Appointment.find({
				stylistUsername: username,
				status: "Scheduled",
			});
		} else {
			return next(
				new ConflictError(`User with username ${username} not found.`)
			);
		}

		res.json(appointments);
	})
);

// Endpoint to mark an appointment as completed
router.put(
	"/:id/complete",
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;

		// Validate ObjectId format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return next(new ConflictError("Invalid appointment ID format."));
		}

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			id,
			{ status: "Completed" },
			{ new: true }
		);

		if (!updatedAppointment) {
			return next(new ConflictError("Appointment not found."));
		}

		res.json({
			message: "Appointment marked as completed successfully.",
			appointment: updatedAppointment,
		});
	})
);

// Endpoint to mark an appointment as canceled
router.put(
	"/:id/cancel",
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;

		// Validate ObjectId format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return next(new ConflictError("Invalid appointment ID format."));
		}

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			id,
			{ status: "Canceled" },
			{ new: true }
		);

		if (!updatedAppointment) {
			return next(new ConflictError("Appointment not found."));
		}

		res.json({
			message: "Appointment marked as canceled successfully.",
			appointment: updatedAppointment,
		});
	})
);

// Endpoint to get availability for each date in a specified month for a stylist
router.get(
	"/availability",
	asyncHandler(async (req, res, next) => {
		// Extract query parameters from the request URL
		const { username, month } = req.query;

		// Validate that both parameters are provided
		if (!username || !month) {
			return next(
				new MalformedRequestError(
					"Stylist username and month are required."
				)
			);
		}

		const currentDate = new Date();
		const year = currentDate.getFullYear();

		// Set the start and end of the month for the query
		const startOfMonth = new Date(year, month - 1, 1); // First day of the specified month
		const endOfMonth = new Date(year, month, 0); // Last day of the specified month

		// Check stylist's availability for each date in the entire month
		let availability = [];

		for (let day = 1; day <= endOfMonth.getDate(); day++) {
			const currentDay = new Date(year, month - 1, day);

			// Count appointments on this date
			const appointmentCount = await Appointment.countDocuments({
				stylistUsername: username,
				appointmentDate: {
					$gte: currentDay,
					$lt: new Date(currentDay.getTime() + 24 * 60 * 60 * 1000),
				},
				status: "Scheduled",
			});

			// Mark date as available if fewer than 3 scheduled appointments
			availability.push({
				date: currentDay.toISOString().split("T")[0],
				available: appointmentCount < 3,
			});
		}

		res.json(availability);
	})
);

export default router;
