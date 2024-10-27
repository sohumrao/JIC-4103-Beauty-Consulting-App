import React, { useContext, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import ContinueButton from "../assets/components/ContinueButton";
import ErrorMessage from "../components/ErrorMessage";

import { getCityFromZIP, validateAddress } from "../geocoding";

const StylistDetails2 = () => {
	const navigation = useNavigation();

	// Access the user context
	const userContext = useContext(UserContext);

	// State for stylist-specific inputs, initialized with empty strings as default
	const [experience, setExperience] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [additionalInfo, setAdditionalInfo] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessAddress, setBusinessAddress] = useState("");

	const [message, setMessage] = useState("");

	const [streetOne, setStreetOne] = useState("");
	const [city, setCity] = useState("");
	const [stateCode, setStateCode] = useState("");
	const [zip, setZip] = useState("");

	const handleContinue = async () => {
		const valid = await validateAddressStylistSide();
		if (!valid) {
			return;
		}
		// Update context with stylist details
		userContext.updateUserContext({
			...userContext, // Keep existing fields in the context (name, age, gender, etc.)
			business: {
				experience: experience || "", // Optional fields can be left empty
				specialty: specialty || "",
				additionalInfo: additionalInfo || "",
				name: businessName || "",
				address: businessAddress || "",
			},
		});
		navigation.navigate("StylistDetails3");
	};

	/*
	 * handles address validation
	 * crux of the issue is that we NEED a zip code to work with
	 * we also need the city, so it will also make sure we have city
	 */
	const validateAddressStylistSide = async () => {
		if (!zip) {
			setMessage("Input a ZIP Code to Continue");
			return false;
		} else if (zip.length != 5 || stateCode.length == 1) {
			// user can get away with only passing ZIP code
			setMessage("Invalid Address Format");
			return false;
		}
		setStreetOne(streetOne.trim());
		setCity(city.trim());

		streetOnePassed = streetOne != "";
		cityPassed = city != "";

		if (streetOnePassed != cityPassed) {
			setMessage("Complete Address to Coninue");
			return false;
		}
		let address = "";
		if (streetOnePassed) {
			address = streetOne + ", " + city + " " + stateCode + ", " + zip;
		} else {
			address = zip;
		}
		const result = await validateAddress(address, streetOnePassed);
		if (!result[0]) {
			setMessage("Error Locating Business, Try Again");
		} else {
			setMessage(null);
			setBusinessAddress(result[1]);
		}
		return result[0];
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
		addressInput: {
			fontSize: 16,
			borderWidth: 1,
			borderColor: "#ccc",
			borderRadius: 5,
			padding: 10,
			marginBottom: 5,
		},
		stateAndZipContainer: {
			flexDirection: "row",
			justifyContent: "space-evenly",
			alignSelf: "stretch",
		},
		stateAndZipInput: {
			fontSize: 16,
			borderWidth: 1,
			padding: 10,
			borderRadius: 5,
			marginBottom: 20,
			borderColor: "#ccc",
			flex: 1,
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

			<Text style={styles.label}>Name of Business (Optional)</Text>
			<TextInput
				style={styles.input}
				value={businessName}
				onChangeText={setBusinessName}
				placeholder="Enter your business name"
			/>

			<Text style={styles.label}>Address of Business (ZIP Required)</Text>
			<TextInput
				style={styles.addressInput}
				value={streetOne}
				onChangeText={setStreetOne}
				placeholder="Street Address 1"
				placeholderTextColor="#707070"
			/>

			<TextInput
				style={styles.addressInput}
				value={city}
				onChangeText={setCity}
				placeholder="City"
				placeholderTextColor="#707070"
			/>

			<View style={styles.stateAndZipContainer}>
				<TextInput
					style={styles.stateAndZipInput}
					value={stateCode}
					onChangeText={setStateCode}
					placeholder="State Postal Code"
					placeholderTextColor="#707070"
					inputMode="text"
					autoCapitalize="characters"
					autoCorrect="false"
					maxLength={2}
				/>

				<TextInput
					style={styles.stateAndZipInput}
					value={zip}
					onChangeText={setZip}
					placeholder="ZIP Code"
					maxLength={5}
					inputMode="numeric"
					placeholderTextColor="#707070"
				/>
			</View>

			<View style={styles.form}>
				<Text style={styles.label}>Years of Experience (Optional)</Text>
				<TextInput
					style={styles.input}
					value={experience}
					onChangeText={setExperience}
					keyboardType="numeric"
					placeholder="Enter your years of experience"
				/>

				<Text style={styles.label}>Specialty (Optional)</Text>
				<TextInput
					style={styles.input}
					value={specialty}
					onChangeText={setSpecialty}
					placeholder="Enter your specialty"
				/>

				<Text style={styles.label}>
					Anything else we should know? (Optional)
				</Text>
				<TextInput
					style={styles.input}
					value={additionalInfo}
					onChangeText={setAdditionalInfo}
					multiline
					placeholder="Enter any additional info"
				/>
			</View>

			<ErrorMessage message={message} />
			<ContinueButton onPress={handleContinue} />
		</ScrollView>
	);
};

export default StylistDetails2;
