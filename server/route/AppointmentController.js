import express from "express";
import Appointment from "../model/appointment.js";
import { Client } from "../model/client.js";
import { Stylist } from "../model/stylist.js";
import asyncHandler from "express-async-handler";
import { ConflictError, MalformedRequestError } from "../errors.js";

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

// Endpoint to get appointments for a client (only scheduled)
router.get(
	"/client/:username",
	asyncHandler(async (req, res, next) => {
		const { username } = req.params;

		const appointments = await Appointment.find({
			clientUsername: username,
			status: "Scheduled",
		});

		if (appointments.length === 0) {
			return next(
				new ConflictError(
					`No scheduled appointments found for client with username ${username}.`
				)
			);
		}

		res.json(appointments);
	})
);

// Endpoint to get appointments for a stylist (only scheduled)
router.get(
	"/stylist/:username",
	asyncHandler(async (req, res, next) => {
		const { username } = req.params;

		const appointments = await Appointment.find({
			stylistUsername: username,
			status: "Scheduled",
		});

		if (appointments.length === 0) {
			return next(
				new ConflictError(
					`No scheduled appointments found for stylist with username ${username}.`
				)
			);
		}

		res.json(appointments);
	})
);

// Endpoint to mark an appointment as completed
router.patch(
	"/:id/complete",
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;

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
router.patch(
	"/:id/cancel",
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;

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

export default router;
