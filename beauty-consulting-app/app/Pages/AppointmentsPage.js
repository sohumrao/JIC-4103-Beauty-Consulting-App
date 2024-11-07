// AppointmentsPage.js
import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import axios from "axios";
import SignupBackground from "../assets/components/SignupBackground";
import { UserContext } from "../contexts/userContext";

function AppointmentsPage() {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { username, role } = useContext(UserContext);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const apiUrl = process.env.EXPO_PUBLIC_API_URL;
				if (!apiUrl) {
					throw new Error("API URL not defined");
				}

				const endpoint =
					role === "client"
						? `${apiUrl}:5050/appointment/client/${username}`
						: `${apiUrl}:5050/appointment/stylist/${username}`;

				const response = await axios.get(endpoint);
				const fetchedAppointments = response.data;

				// No need to map clientUsername and stylistUsername anymore
				// as the backend now populates 'client' and 'stylist'

				// Sort appointments by date and time
				const sortedAppointments = fetchedAppointments.sort(
					(a, b) =>
						new Date(a.appointmentDate) -
						new Date(b.appointmentDate)
				);

				setAppointments(sortedAppointments);
			} catch (err) {
				console.error("Error fetching appointments: ", err);
				setError(
					"Failed to load appointments. Please try again later."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [username, role]);

	// Function to group appointments by date
	const groupAppointmentsByDate = (appointments) => {
		return appointments.reduce((groups, appointment) => {
			const date = new Date(appointment.appointmentDate)
				.toISOString()
				.split("T")[0];
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(appointment);
			return groups;
		}, {});
	};

	// Get grouped appointments
	const groupedAppointments = groupAppointmentsByDate(appointments);

	// Get sorted dates
	const sortedDates = Object.keys(groupedAppointments).sort(
		(a, b) => new Date(a) - new Date(b)
	);

	if (loading) {
		return (
			<SignupBackground>
				<View style={styles.loaderContainer}>
					<ActivityIndicator size="large" color="#0000ff" />
					<Text>Loading Appointments...</Text>
				</View>
			</SignupBackground>
		);
	}

	if (error) {
		return (
			<SignupBackground>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			</SignupBackground>
		);
	}

	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Appointments</Text>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					{appointments.length === 0 ? (
						<Text style={styles.noAppointmentsText}>
							No scheduled appointments found.
						</Text>
					) : (
						sortedDates.map((date) => (
							<View key={date} style={styles.dateGroup}>
								<Text style={styles.dateHeader}>
									{new Date(date).toLocaleDateString(
										undefined,
										{
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										}
									)}
								</Text>
								{groupedAppointments[date].map(
									(appointment) => (
										<View
											key={appointment._id}
											style={styles.appointmentBox}
										>
											<Text style={styles.clientName}>
												Client:{" "}
												{appointment.client.info.name}
											</Text>
											<Text style={styles.stylistName}>
												Stylist:{" "}
												{appointment.stylist.info.name}
											</Text>
											<Text style={styles.details}>
												Date:{" "}
												{new Date(
													appointment.appointmentDate
												).toLocaleDateString()}
											</Text>
											<Text style={styles.details}>
												Time:{" "}
												{new Date(
													appointment.appointmentDate
												).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</Text>
											<Text style={styles.details}>
												Duration: {appointment.duration}{" "}
												mins
											</Text>
											<Text style={styles.details}>
												Status: {appointment.status}
											</Text>
											{appointment.notes ? (
												<Text style={styles.details}>
													Notes: {appointment.notes}
												</Text>
											) : null}
										</View>
									)
								)}
							</View>
						))
					)}
				</ScrollView>
			</View>
		</SignupBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		width: "100%",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 30,
		marginTop: 40,
	},
	scrollContainer: {
		paddingBottom: 20,
	},
	dateGroup: {
		marginBottom: 20,
	},
	dateHeader: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	appointmentBox: {
		backgroundColor: "#fff",
		padding: 15,
		marginVertical: 5,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	clientName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
	},
	stylistName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
	},
	details: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		color: "red",
		fontSize: 16,
		textAlign: "center",
	},
	noAppointmentsText: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
		marginTop: 20,
	},
});

export default AppointmentsPage;
