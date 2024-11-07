// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

// const AppointmentSchema = new Schema({
// 	clientUsername: { type: String },
// 	stylistUsername: { type: String },
// 	appointmentDate: { type: Date }, // Date of the appointment
// 	duration: { type: Number }, // Duration in minutes
// 	status: {
// 		type: String,
// 		enum: ["Scheduled", "Completed", "Canceled"], // Appointment status
// 		default: "Scheduled",
// 	},
// 	notes: {
// 		type: String,
// 		required: false,
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now,
// 	},
// });

// const Appointment = mongoose.model("Appointment", AppointmentSchema);

// export default Appointment;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
	stylist: { type: Schema.Types.ObjectId, ref: "Stylist", required: true },
	appointmentDate: { type: Date, required: true },
	duration: { type: Number, required: true },
	status: {
		type: String,
		enum: ["Scheduled", "Completed", "Canceled"],
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
