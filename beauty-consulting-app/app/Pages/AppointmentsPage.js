import React, { useState, useContext, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import SignupBackground from "../assets/components/SignupBackground";
import { UserContext } from "../contexts/userContext";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import ErrorMessage from "../components/ErrorMessage";
import { formatDate, formatTime } from "utils/utils";

function AppointmentsPage() {
	const { username, role } = useContext(UserContext);
	const [appointments, setAppointments] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [refreshing, setRefreshing] = useState(false); // Add this state

	const fetchAppointments = async () => {
		try {
			const response = await api.get("/appointment/scheduled", {
				params: {
					username: username,
				},
			});

			console.log(response);

			setAppointments(response.data);
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	useEffect(() => {
		fetchAppointments();
	}, [username]);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchAppointments().then(() => setRefreshing(false));
	}, [username]);

	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Appointments</Text>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={["#000"]} // Android
							tintColor="#000" // iOS
						/>
					}
				>
					<ErrorMessage message={errorMessage} />
					{appointments.map((appointment) => (
						<TouchableOpacity
							key={appointment._id}
							style={styles.appointmentBox}
						>
							<Text style={styles.name}>
								{role === "stylist"
									? appointment.clientUsername
									: appointment.stylistUsername}
							</Text>
							<Text style={styles.details}>
								Date: {formatDate(appointment.appointmentDate)}
							</Text>
							<Text style={styles.details}>
								Time: {formatTime(appointment.appointmentDate)}
							</Text>
						</TouchableOpacity>
					))}
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
		width: "90%",
		alignSelf: "center",
	},
	name: {
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
