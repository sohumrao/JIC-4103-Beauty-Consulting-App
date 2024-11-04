import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import SignupBackground from "../assets/components/SignupBackground";
import MyCalendar from "../assets/components/Calendar";

function AppointmentsPage() {
	const [appointments, setAppointments] = useState([
		// Example appointments data
		{
			id: 1,
			clientName: "John Doe",
			date: "2024-10-10",
			time: "10:00 AM",
			service: "Haircut",
		},
		{
			id: 2,
			clientName: "Jane Smith",
			date: "2024-10-11",
			time: "12:00 PM",
			service: "Hair Coloring",
		},
		{
			id: 3,
			clientName: "Alex Johnson",
			date: "2024-10-12",
			time: "02:30 PM",
			service: "Nail Care",
		},
	]);

	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Appointments</Text>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{appointments.map((appointment) => (
						<TouchableOpacity
							key={appointment.id}
							style={styles.appointmentBox}
						>
							<Text style={styles.clientName}>
								{appointment.clientName}
							</Text>
							<Text style={styles.details}>
								Date: {appointment.date}
							</Text>
							<Text style={styles.details}>
								Time: {appointment.time}
							</Text>
							<Text style={styles.details}>
								Service: {appointment.service}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
			<MyCalendar />
		</SignupBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		// backgroundColor: "#f9f9f9", this is for debugging purposes to see the container size
		width: "100%", // Ensure the container takes up the entire horizontal space
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 30, // Increased margin to lower the header
		marginTop: 40, // Added margin to provide spacing from the top
	},
	scrollContainer: {
		paddingBottom: 20, // Adds padding at the bottom to allow scrolling
	},
	appointmentBox: {
		backgroundColor: "#fff",
		padding: 15,
		marginVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		width: "90%",
		// maxWidth: 400, // Optional: Ensure it doesn't become too wide on larger screens
		alignSelf: "center", // Center it within the container
	},
	clientName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	details: {
		fontSize: 16,
		color: "#555",
	},
});

export default AppointmentsPage;
