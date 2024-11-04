import { View, Modal, Text, TouchableOpacity } from "react-native";
import { React, useState } from "react";
import globalStyles from "../GlobalStyles";
import myCalendar from "./Calendar";

export const renderAppointmentModal = (
	visible,
	createAppointment,
	hideModal
) => {
	return (
		<Modal visible={visible} transparent={false} animationType="slide">
			<View style={globalStyles.directoryHeaderContainer}>
				<Text style={globalStyles.directoryHeaderText}>
					Book Appointment
				</Text>
			</View>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<View style={globalStyles.box}>
					<Text style={globalStyles.title}> CALENDAR GOES HERE</Text>
					<MyCalendar onDaySelect={handleDaySelect} />
				</View>
				<View style={globalStyles.box}>
					<Text style={globalStyles.title}> DATES GOES HERE</Text>
				</View>
				<View style={globalStyles.box}>
					<Text style={globalStyles.title}> TIMES GOES HERE</Text>
				</View>
				<TouchableOpacity
					style={[globalStyles.button, { marginBottom: 10 }]}
					onPress={() => {
						createAppointment();
					}}
				>
					<Text style={globalStyles.buttonText}> Book Time </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={() => {
						hideModal();
					}}
				>
					<Text style={globalStyles.buttonText}> Go Back </Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};
