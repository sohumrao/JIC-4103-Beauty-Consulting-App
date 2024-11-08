import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { UserContext } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import api from "utils/axios";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import handleHTTPError from "utils/errorHandling";
import { formatDate } from "utils/utils";
import StylistServices from "../components/StylistServices";

const BusinessInfoPage = (routeObject) => {
	// Access the user context
	const userContext = useContext(UserContext);
	const navigation = useNavigation();
	const [stylistData, setStylistData] = useState(null);

	//TODO: make BusinessInfo take in stylist_id as a prop, and set editable as whether or not stylist_id is equal to usercontext_id
	const editable = true;

	useEffect(() => {
		console.log(routeObject);
		if (userContext.role == "client") {
			populateStylistData(routeObject.route.params.stylistUsername);
		} else {
			populateStylistData(userContext.username);
		}
	}, [routeObject]);

	const populateStylistData = async (username) => {
		try {
			const res = await api.get(`/stylist/${username}`);
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
			<StylistServices
				stylistData={stylistData}
				setStylistData={setStylistData}
				editable={editable}
			/>
			{userContext.role === "client" ? (
				<Button onPress={() => navigation.goBack()}>
					Back to Directory
				</Button>
			) : null}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		marginTop: 20, // temp fix to make more readable, TODO:
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
