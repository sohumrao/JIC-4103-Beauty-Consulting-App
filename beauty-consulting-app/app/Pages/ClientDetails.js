import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import ContinueButton from "../assets/components/ContinueButton";
import KeyboardMove from "../assets/components/KeyboardMove";

const ClientDetails = () => {
	const navigation = useNavigation();
	const [formData, setFormData] = useState({
		name: "",
		birthday: new Date(),
		gender: "male",
		phoneNumber: "",
		email: "",
	});
	const [error, setError] = useState("");

	const userContext = useContext(UserContext);

	// Updating context values when continue button is hit
	const handleContinue = async () => {
		try {
			userContext.updateUserContext({
				username: userContext.username,
				...formData,
				hairDetails: userContext.hairDetails,
				allergies: userContext.allergies,
				concerns: userContext.concerns,
			});
			navigation.navigate("ClientDetails2");
		} catch (error) {
			console.log(error);
		}
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

	return (
		<KeyboardAwareScrollView style={styles.container}>
			<Text style={styles.header}>Client Details</Text>

			<View style={styles.stepIndicator}>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={styles.step}></View>
				<View style={styles.step}></View>
				<View style={styles.step}></View>
			</View>

			<View style={styles.form}>
				<Text style={styles.label}>Name</Text>
				<TextInput
					style={styles.input}
					value={formData.name}
					onChangeText={(text) =>
						setFormData({ ...formData, name: text })
					}
				/>

				<View style={styles.birthdayContainer}>
					<Text style={styles.label}>Birth Date</Text>
					<DateTimePicker
						value={formData.birthday}
						mode="date"
						onChange={(event, date) => {
							setFormData({
								...formData,
								birthday: new Date(date),
							});
						}}
						//key is used so that the dialog dismisses on date selection, see https://github.com/react-native-datetimepicker/datetimepicker/issues/602
						key={formData.birthday.toISOString()}
					/>
				</View>

				<Text style={styles.label}>Gender</Text>
				{/* REDO THIS PART BUBBLES AND CLICK ON TEXT*/}
				<View style={styles.radioContainer}>
					<RadioButton
						value="male"
						status={
							formData.gender === "male" ? "checked" : "unchecked"
						}
						onPress={() =>
							setFormData({ ...formData, gender: "male" })
						}
					/>
					<Text>Male</Text>
					<RadioButton
						value="female"
						status={
							formData.gender === "female"
								? "checked"
								: "unchecked"
						}
						onPress={() =>
							setFormData({ ...formData, gender: "female" })
						}
					/>
					<Text>Female</Text>
					<RadioButton
						value="other"
						status={
							formData.gender === "other"
								? "checked"
								: "unchecked"
						}
						onPress={() =>
							setFormData({ ...formData, gender: "other" })
						}
					/>
					<Text>Other</Text>
				</View>

				<Text style={styles.label}>Mobile Number</Text>
				<TextInput
					style={styles.input}
					keyboardType="phone-pad"
					value={formData.phoneNumber}
					onChangeText={(text) =>
						setFormData({ ...formData, phoneNumber: text })
					}
				/>

				<Text style={styles.label}>Email</Text>
				<TextInput
					style={styles.input}
					keyboardType="email-address"
					value={formData.email}
					onChangeText={(text) =>
						setFormData({ ...formData, email: text })
					}
				/>
			</View>
			<ContinueButton onPress={() => handleContinue()} />
		</KeyboardAwareScrollView>
	);
};

export default ClientDetails;
