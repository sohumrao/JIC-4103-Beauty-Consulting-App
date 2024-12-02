import React, { useState, useContext } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import ContinueButton from "../assets/components/ContinueButton";
import DateTimePicker from "@react-native-community/datetimepicker";

const StylistDetails = () => {
	const navigation = useNavigation();

	// State for user input
	const [gender, setGender] = useState("male");
	const [name, setName] = useState("");
	const [birthday, setbirthday] = useState(new Date());
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [experience, setExperience] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [additionalInfo, setAdditionalInfo] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessAddress, setBusinessAddress] = useState("");

	const userContext = useContext(UserContext);

	// Handle continue button press
	const handleContinue = () => {
		userContext.updateUserContext({
			...userContext,
			name: name,
			birthday: birthday,
			gender: gender,
			phoneNumber: phoneNumber,
			email: email,
		});
		// console.log('Navigating to StylistDetails2');
		navigation.navigate("StylistDetails2");
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Stylist Details</Text>

			<View style={styles.stepIndicator}>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={styles.step}></View>
				<View style={styles.step}></View>
			</View>

			<View style={styles.form}>
				<Text style={styles.label}>Name</Text>
				<TextInput
					style={styles.input}
					value={name}
					onChangeText={setName}
				/>

				<View style={styles.birthdayContainer}>
					<Text style={styles.label}>Birth Date</Text>
					<DateTimePicker
						value={birthday}
						mode="date"
						onChange={(event, date) => {
							setbirthday(new Date(date));
						}}
						//key is used so that the dialog dismisses on date selection, see https://github.com/react-native-datetimepicker/datetimepicker/issues/602
						key={birthday.toISOString()}
					/>
				</View>

				<Text style={styles.label}>Gender</Text>
				<View style={styles.radioContainer}>
					<RadioButton
						value="male"
						status={gender === "male" ? "checked" : "unchecked"}
						onPress={() => setGender("male")}
					/>
					<Text>Male</Text>
					<RadioButton
						value="female"
						status={gender === "female" ? "checked" : "unchecked"}
						onPress={() => setGender("female")}
					/>
					<Text>Female</Text>
					<RadioButton
						value="other"
						status={gender === "other" ? "checked" : "unchecked"}
						onPress={() => setGender("other")}
					/>
					<Text>Other</Text>
				</View>

				<Text style={styles.label}>Mobile Number</Text>
				<TextInput
					style={styles.input}
					keyboardType="phone-pad"
					value={phoneNumber}
					onChangeText={setPhoneNumber}
				/>

				<Text style={styles.label}>Email</Text>
				<TextInput
					style={styles.input}
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>
			</View>

			<ContinueButton onPress={handleContinue} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	header: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	stepIndicator: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	step: {
		flex: 1,
		height: 5,
		backgroundColor: "#eee",
		borderRadius: 2.5,
		marginHorizontal: 2,
	},
	stepCompleted: {
		backgroundColor: "red",
	},
	form: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		marginBottom: 10,
	},
	input: {
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
	},
	birthdayContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	ageInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginHorizontal: 5,
		marginBottom: 20,
	},
	radioContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	continueButton: {
		backgroundColor: "red",
		padding: 15,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	continueButtonText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "bold",
	},
});

export default StylistDetails;
