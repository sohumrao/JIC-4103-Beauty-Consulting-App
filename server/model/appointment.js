import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
	client: { type: mongoose.Types.ObjectId, ref: "Client" },
	stylist: { type: mongoose.Types.ObjectId, ref: "Stylist" },
	appointmentDate: { type: Date }, // Date of the appointment
	duration: { type: Number }, // Duration in minutes
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
