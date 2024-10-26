import React, { useContext, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import ContinueButton from "../assets/components/ContinueButton";

const StylistDetails2 = () => {
	const navigation = useNavigation();

	// Access the user context
	const userContext = useContext(UserContext);

	// State for stylist-specific inputs, initialized with context values if available
	const [experience, setExperience] = useState(
		userContext.business.experience || ""
	);
	const [specialty, setSpecialty] = useState(
		userContext.business.specialty || ""
	);
	const [additionalInfo, setAdditionalInfo] = useState(
		userContext.business.additionalInfo || ""
	);
	const [businessName, setBusinessName] = useState(
		userContext.business.name || ""
	);
	const [businessAddress, setBusinessAddress] = useState(
		userContext.business.address || ""
	);

	const handleContinue = () => {
		// Update context with stylist details
		userContext.updateUserContext({
			...userContext, // Keep existing fields in the context (name, birthday, gender, etc.)
			business: {
				...userContext.business,
				experience: experience,
				specialty: specialty,
				additionalInfo: additionalInfo,
				name: businessName,
				address: businessAddress,
				city: "Atlanta", //TODO: default for now, fix when locaiton-based search implemented
			},
		});
		navigation.navigate("StylistDetails3");
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
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Stylist Details</Text>

			<View style={styles.stepIndicator}>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={styles.step}></View>
			</View>

			<Text style={styles.label}>Name of Business</Text>
			<TextInput
				style={styles.input}
				value={businessName}
				onChangeText={setBusinessName}
				placeholder="Enter your business name"
			/>

			<Text style={styles.label}>Address of Business</Text>
			<TextInput
				style={styles.input}
				value={businessAddress}
				onChangeText={setBusinessAddress}
				placeholder="Enter your business address"
			/>

			<View style={styles.form}>
				<Text style={styles.label}>Years of Experience</Text>
				<TextInput
					style={styles.input}
					value={experience}
					onChangeText={setExperience}
					keyboardType="numeric"
					placeholder="Enter your years of experience"
				/>

				<Text style={styles.label}>Specialty</Text>
				<TextInput
					style={styles.input}
					value={specialty}
					onChangeText={setSpecialty}
					placeholder="Enter your specialty"
				/>

				<Text style={styles.label}>Anything else we should know?</Text>
				<TextInput
					style={styles.input}
					value={additionalInfo}
					onChangeText={setAdditionalInfo}
					multiline
					placeholder="Enter any additional info"
				/>
			</View>

			<ContinueButton onPress={handleContinue} />
		</ScrollView>
	);
};

export default StylistDetails2;
