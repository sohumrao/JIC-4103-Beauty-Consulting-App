import React, { useState, useContext, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Modal,
	TouchableOpacity,
} from "react-native";
import SignupBackground from "../assets/components/SignupBackground";
import { UserContext } from "../contexts/userContext";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import ErrorMessage from "../components/ErrorMessage";
import { formatDate, formatTime } from "utils/utils";
import AppointmentBlock from "../components/appointmentBlock";
import globalStyles from "../assets/GlobalStyles";

function AppointmentsPage() {
	const userContext = useContext(UserContext);
	const [appointments, setAppointments] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);

	const [cancelUsername, setCancelUsername] = useState("");
	const [cancelTime, setCancelTime] = useState("");
	const [cancelID, setCancelID] = useState("");

	const fetchAppointments = async () => {
		try {
			const response = await api.get("/appointment/scheduled", {
				params: {
					username: userContext.username,
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
	}, [userContext.username]);

	handleCancelPress = (username, dateString, id) => {
		setCancelUsername(username);
		setCancelTime(dateString);
		setCancelID(id);
		setModalVisible(true);
	};

	const confirmCancel = async () => {
		try {
			req = { id: cancelID };
			const response = await api.put(
				"appointment/" + cancelID + "/cancel",
				req
			);
			setModalVisible(false);
			fetchAppointments();
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	// TODO: would be nice to display actual names rather than username
	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Appointments</Text>
				<ScrollView contentContainerStyle={styles.scrollContainer}>
					<ErrorMessage message={errorMessage} />
					{appointments.map((appointment) => (
						<View key={appointment._id}>
							<AppointmentBlock
								name={
									userContext.role === "stylist"
										? appointment.clientUsername
										: appointment.stylistUsername
								}
								date={formatDate(appointment.appointmentDate)}
								time={formatTime(appointment.appointmentDate)}
								cancelAppointment={() => {
									handleCancelPress(
										userContext.role === "stylist"
											? appointment.clientUsername
											: appointment.stylistUsername,
										appointment.appointmentDate,
										appointment._id
									);
								}}
							/>
						</View>
					))}
				</ScrollView>
				<Modal
					visible={modalVisible}
					transparent={false}
					animationType="slide"
				>
					<SignupBackground>
						<View style={globalStyles.box}>
							<Text style={globalStyles.title}>
								Cancel Appointment
							</Text>
							<Text
								style={[
									globalStyles.promptText,
									{ marginBottom: 10 },
								]}
							>
								Cancel your appointment with {cancelUsername} at{" "}
								{formatTime(cancelTime)} on{" "}
								{formatDate(cancelTime)}?
							</Text>
							<TouchableOpacity
								style={[globalStyles.button, { marginTop: 10 }]}
								onPress={confirmCancel}
							>
								<Text style={globalStyles.buttonText}>
									Confirm Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[globalStyles.button, { marginTop: 10 }]}
								onPress={() => {
									setModalVisible(false);
									setErrorMessage(null);
								}}
							>
								<Text style={globalStyles.buttonText}>
									Go Back
								</Text>
							</TouchableOpacity>
							<ErrorMessage message={errorMessage} />
						</View>
					</SignupBackground>
				</Modal>
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
