import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import globalStyles from "../GlobalStyles";
import MyCalendar from "./Calendar";
import api from "utils/axios";

const AppointmentModal = ({
	visible,
	onClose,
	onCreateAppointment,
	stylistUsername,
}) => {
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [timeSlots, setTimeSlots] = useState([]);

	const handleDaySelect = async (day) => {
		setSelectedDay(day.dateString);
		setSelectedTime(null);
		availableTimes = await generateTimeSlots(day.dateString);
		setTimeSlots(availableTimes);
	};

	const generateTimeSlots = async (date) => {
		const slots = [];
		let startTime = new Date();
		startTime.setHours(9, 0, 0, 0);
		const endTime = new Date();
		endTime.setHours(17, 0, 0, 0);

		const res = await api.get(
			`/appointment/gettimes?stylistUsername=${stylistUsername}&date=${date}`
		);
		const unavailable = res.data.unavailable;
		console.log(unavailable);

		while (startTime < endTime) {
			const timeString = startTime.toTimeString().slice(0, 5);
			if (!unavailable.includes(timeString)) {
				slots.push(timeString);
			}
			startTime.setMinutes(startTime.getMinutes() + 30);
		}

		return slots;
	};

	return (
		<Modal visible={visible} transparent={false} animationType="slide">
			<ScrollView>
				<View>
					<View style={globalStyles.directoryHeaderContainer}>
						<Text style={globalStyles.directoryHeaderText}>
							Book Appointment
						</Text>
					</View>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View
							style={[
								globalStyles.box,
								{
									marginTop: 20,
									marginBottom: 10,
									width: "90%",
								},
							]}
						>
							<MyCalendar onDaySelect={handleDaySelect} />
						</View>
						<View
							style={[
								globalStyles.box,
								{
									marginTop: 10,
									marginBottom: 20,
									width: "90%",
								},
							]}
						>
							<Text style={globalStyles.title}>
								Available Times
							</Text>
							{selectedDay ? (
								<ScrollView horizontal={true}>
									{timeSlots.map((time) => (
										<TouchableOpacity
											key={time}
											style={[
												styles.button,
												{
													marginVertical: 5,
													backgroundColor: "#CCC",
												},
												selectedTime === time && {
													backgroundColor: "#FF5252",
												},
											]}
											onPress={() =>
												setSelectedTime(time)
											}
										>
											<Text
												style={globalStyles.buttonText}
											>
												{time}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							) : (
								<Text style={globalStyles.promptText}>
									Select a date to see times
								</Text>
							)}
						</View>
						<TouchableOpacity
							style={[
								globalStyles.button,
								{ marginBottom: 10, width: "70%" },
							]}
							onPress={() =>
								onCreateAppointment(selectedDay, selectedTime)
							}
							disabled={!selectedTime}
						>
							<Text style={globalStyles.buttonText}>
								Book Time
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[globalStyles.button, { width: "70%" }]}
							onPress={onClose}
						>
							<Text style={globalStyles.buttonText}>Go Back</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#FF5252",
		padding: 8,
		justifyContent: "center",
		marginHorizontal: 5,
		marginVertical: 5,
		borderRadius: "50%",
	},
});
export default AppointmentModal;
