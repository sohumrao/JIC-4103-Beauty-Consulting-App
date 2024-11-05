import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import globalStyles from "../GlobalStyles";
import MyCalendar from "./Calendar";

const AppointmentModal = ({ visible, onClose, onCreateAppointment }) => {
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	const handleDaySelect = (day) => {
		setSelectedDay(day.dateString);
		setSelectedTime(null);
	};

	const generateTimeSlots = () => {
		const slots = [];
		let startTime = new Date();
		startTime.setHours(9, 0, 0, 0);
		const endTime = new Date();
		endTime.setHours(17, 0, 0, 0);

		while (startTime < endTime) {
			const timeString = startTime.toTimeString().slice(0, 5);
			slots.push(timeString);
			startTime.setMinutes(startTime.getMinutes() + 30);
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	return (
		<Modal visible={visible} transparent={false} animationType="slide">
			<ScrollView>
				<View style={globalStyles.directoryHeaderContainer}>
					<Text style={globalStyles.directoryHeaderText}>
						Book Appointment
					</Text>
				</View>
				<View style={{ flex: 1, justifyContent: "center" }}>
					<View style={globalStyles.box}>
						<Text style={globalStyles.title}>
							CALENDAR GOES HERE
						</Text>
						<MyCalendar onDaySelect={handleDaySelect} />
					</View>
					<View style={globalStyles.box}>
						<Text style={globalStyles.title}>
							{selectedDay
								? `Selected Date: ${selectedDay}`
								: "No date selected"}
						</Text>
					</View>
					<View style={globalStyles.box}>
						<Text style={globalStyles.title}>Available Times</Text>
						{selectedDay ? (
							<ScrollView>
								{timeSlots.map((time) => (
									<TouchableOpacity
										key={time}
										style={[
											globalStyles.button,
											{ marginVertical: 5 },
											selectedTime === time && {
												backgroundColor: "#FF5252",
											}, // Highlight selected time
										]}
										onPress={() => setSelectedTime(time)}
									>
										<Text style={globalStyles.buttonText}>
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
						style={[globalStyles.button, { marginBottom: 10 }]}
						onPress={() =>
							onCreateAppointment(selectedDay, selectedTime)
						}
						disabled={!selectedTime} // Disable if no time selected
					>
						<Text style={globalStyles.buttonText}>Book Time</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={globalStyles.button}
						onPress={onClose}
					>
						<Text style={globalStyles.buttonText}>Go Back</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</Modal>
	);
};

export default AppointmentModal;
