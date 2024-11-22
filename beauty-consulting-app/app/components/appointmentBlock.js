import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import globalStyles from "../assets/GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const AppointmentBlock = ({ account, date, time, cancelAppointment }) => {
	const navigation = useNavigation(); // Add this hook
	return (
		<View style={styles.appointmentBox}>
			// FIXME: this hack is quite ugly
			<TouchableOpacity
				onPress={() => {
					const page =
						account.__t === "Stylist"
							? "BusinessInfoPage"
							: "ProfileView";
					navigation.navigate(page, { username: account.username });
				}}
			>
				<Text style={styles.name}>{account.info.name}</Text>
			</TouchableOpacity>
			<Text style={styles.details}> {date}</Text>
			<Text style={styles.details}> {time}</Text>
			<View
				style={{
					padding: 10,
					alignItems: "flex-end",
				}}
			>
				<TouchableOpacity
					style={[globalStyles.button, { width: "50%" }]}
					onPress={cancelAppointment}
				>
					<Text style={globalStyles.buttonText}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

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

export default AppointmentBlock;
