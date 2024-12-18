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
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay"; // Import the component

function AppointmentsPage() {
	// Destructure profilePhoto directly from UserContext
	const { username, role, profilePhoto } = useContext(UserContext);
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
			await api.put(`appointment/${cancelID}/cancel`, req);
			setModalVisible(false);
			fetchAppointments();
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	return (
		<SignupBackground>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Header Bar */}
					<View style={styles.headerBar}>
						{/* Profile Photo */}
						<ProfilePhotoDisplay
							profilePhoto={profilePhoto}
							styleProp={styles.profilePhoto}
						/>
						{/* Title */}
						<Text style={styles.headerTitle}>Appointments</Text>
						{/* Placeholder for balancing the header layout */}
						<View style={styles.headerRightPlaceholder} />
					</View>
					{/* End of Header Bar */}

					{/* Main Content */}
					<ScrollView
						contentContainerStyle={styles.scrollContainer}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								colors={["#007bff"]} // Android
								tintColor="#007bff" // iOS
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
													? appointment.client
															.username
													: appointment.stylist
															.username,
												appointment.appointmentDate,
												appointment._id
											);
										}}
									/>
								</View>
							))
						)}
					</ScrollView>
					{/* End of Main Content */}

					<Modal
						visible={modalVisible}
						transparent={true} // Allows overlay effect
						animationType="fade" // Smooth transition
					>
						<View style={globalStyles.modalOverlay}>
							<View style={globalStyles.modalContent}>
								<Text style={globalStyles.modalTitle}>
									Cancel Appointment
								</Text>
								<Text style={globalStyles.modalText}>
									Cancel your appointment with{" "}
									{cancelUsername} at {formatTime(cancelTime)}{" "}
									on {formatDate(cancelTime)}?
								</Text>
								<View style={globalStyles.modalButtonContainer}>
									<TouchableOpacity
										style={[
											globalStyles.button,
											{
												backgroundColor: "#808080",
												width: "45%",
											},
										]}
										onPress={() => {
											setModalVisible(false);
											setErrorMessage(null);
										}}
									>
										<Text style={globalStyles.buttonText}>
											Go Back
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											globalStyles.button,
											{ width: "45%" },
										]}
										onPress={confirmCancel}
									>
										<Text style={globalStyles.buttonText}>
											Confirm Cancel
										</Text>
									</TouchableOpacity>
								</View>
								<ErrorMessage message={errorMessage} />
							</View>
						</View>
					</Modal>
				</View>
			</SafeAreaView>
		</SignupBackground>
	);
}

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 20,
	},
	headerBar: {
		height: 60,
		width: 350,
		backgroundColor: "#fa4e41",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderRadius: 8,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		// marginTop: 60
	},
	profilePhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
	},
	placeholderPhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#555",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRightPlaceholder: {
		width: 40, // To balance the header layout since left has profile photo
	},
	scrollContainer: {
		paddingBottom: 20,
	},
	details: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
		marginTop: 20,
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
