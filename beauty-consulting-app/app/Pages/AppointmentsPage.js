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
						? `${apiUrl}:5050/appointments/client/${username}`
						: `${apiUrl}:5050/appointments/stylist/${username}`;

				const response = await axios.get(endpoint);
				setAppointments(response.data);
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
						appointments.map((appointment) => (
							<TouchableOpacity
								key={appointment._id}
								style={styles.appointmentBox}
							>
								{/* If populated */}
								{appointment.clientUsername &&
								appointment.clientUsername.info ? (
									<Text style={styles.clientName}>
										Client:{" "}
										{appointment.clientUsername.info.name}
									</Text>
								) : (
									<Text style={styles.clientName}>
										Client: {appointment.clientUsername}
									</Text>
								)}
								{/* If populated */}
								{appointment.stylistUsername &&
								appointment.stylistUsername.business ? (
									<Text style={styles.stylistName}>
										Stylist:{" "}
										{
											appointment.stylistUsername.business
												.name
										}
									</Text>
								) : (
									<Text style={styles.stylistName}>
										Stylist: {appointment.stylistUsername}
									</Text>
								)}
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
									).toLocaleTimeString()}
								</Text>
								<Text style={styles.details}>
									Duration: {appointment.duration} mins
								</Text>
								<Text style={styles.details}>
									Status: {appointment.status}
								</Text>
								{appointment.notes ? (
									<Text style={styles.details}>
										Notes: {appointment.notes}
									</Text>
								) : null}
							</TouchableOpacity>
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
		width: "95%",
		alignSelf: "center",
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
