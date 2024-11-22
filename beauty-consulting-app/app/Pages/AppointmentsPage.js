import React, { useState, useContext, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Modal,
	TouchableOpacity,
	RefreshControl,
	Dimensions,
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
	const { username, role } = useContext(UserContext);
	const [appointments, setAppointments] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [cancelUsername, setCancelUsername] = useState("");
	const [cancelTime, setCancelTime] = useState("");
	const [cancelID, setCancelID] = useState("");

	const fetchAppointments = async () => {
		try {
			const response = await api.get("/appointment/scheduled", {
				params: {
					username: username,
				},
			});

			setAppointments(response.data);
			setErrorMessage(null);
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

	const handleCancelPress = (username, dateString, id) => {
		setCancelUsername(username);
		setCancelTime(dateString);
		setCancelID(id);
		setModalVisible(true);
	};

	const confirmCancel = async () => {
		try {
			const req = { id: cancelID };
			await api.put("appointment/" + cancelID + "/cancel", req);
			setModalVisible(false);
			fetchAppointments();
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

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
					{appointments.length === 0 ? (
						<Text style={styles.details}>
							No appointments booked
						</Text>
					) : (
						appointments.map((appointment) => (
							<View key={appointment._id}>
								<AppointmentBlock
									account={
										role === "stylist"
											? appointment.client
											: appointment.stylist
									}
									date={formatDate(
										appointment.appointmentDate
									)}
									time={formatTime(
										appointment.appointmentDate
									)}
									cancelAppointment={() => {
										handleCancelPress(
											role === "stylist"
												? appointment.client.username
												: appointment.stylist.username,
											appointment.appointmentDate,
											appointment._id
										);
									}}
								/>
							</View>
						))
					)}
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

const screenWidth = Dimensions.get("window").width;
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
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignSelf: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 20,
		alignItems: "center",
		textAlign: "center",
	},
	profileDetail: {
		fontSize: 24,
		marginBottom: 10,
	},
	label: {
		fontWeight: "bold",
	},
	closeButton: {
		marginTop: 40,
		backgroundColor: "#007bff",
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	closeButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	photo: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5, // Ensures height is equal to width
		borderRadius: (screenWidth * 0.5) / 2, // Half of the width for a perfect circle
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
	},
});

export default AppointmentsPage;
