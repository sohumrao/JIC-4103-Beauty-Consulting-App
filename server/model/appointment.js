import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
	clientUsername: { type: String, required: false },
	stylistUsername: { type: String, required: false },
	appointmentDate: { type: Date, required: false }, // Date of the appointment
	duration: { type: Number, required: false }, // Duration in minutes
	status: {
		type: String,
		enum: ["Scheduled", "Completed", "Canceled"], // Appointment status
		default: "Scheduled",
	},
	notes: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
