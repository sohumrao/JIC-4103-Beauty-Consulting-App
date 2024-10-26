import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { UserContext, userContextProvider } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import ProfileImage from "../assets/components/ProfileImage";
import axios from "axios";
import handleHTTPError from "../errorHandling";
import { formatDate } from "../utils";

const BusinessInfoPage = () => {
	// Access the user context
	const userContext = useContext(UserContext);

	var [stylistData, setStylistData] = useState(null);

	useEffect(() => {
		populateStylistData(userContext.username);
	}, [userContext.username]);

	const populateStylistData = async (username) => {
		try {
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL + ":5050/stylist/" + username;
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}

			const res = await axios.get(apiURL);
			setStylistData(res.data);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	if (!stylistData) {
		return (
			<View style={globalStyles.box}>
				<Text style={globalStyles.promptText}>Loading...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>{stylistData.business.name}</Text>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Stylist Name:</Text>
				<Text style={styles.value}>{stylistData.info.name}</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Business Address:</Text>
				<Text style={styles.value}>{stylistData.business.address}</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Birthday:</Text>
				<Text style={styles.value}>
					{formatDate(stylistData.info.birthday)}
				</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Phone Number:</Text>
				<Text style={styles.value}>{stylistData.info.phoneNumber}</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Email:</Text>
				<Text style={styles.value}>{stylistData.email}</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Years of Experience:</Text>
				<Text style={styles.value}>
					{stylistData.business.experience}
				</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Specialty:</Text>
				<Text style={styles.value}>
					{stylistData.business.specialty}
				</Text>
			</View>

			<View style={styles.infoContainer}>
				<Text style={styles.label}>Additional Info:</Text>
				<Text style={styles.value}>
					{stylistData.business.additionalInfo}
				</Text>
			</View>
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
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	infoContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
	},
	value: {
		fontSize: 16,
		color: "#555",
	},
});

export default BusinessInfoPage;
