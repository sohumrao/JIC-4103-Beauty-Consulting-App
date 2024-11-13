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
import ImageUploadButton from "../assets/components/ImageUploadButton";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";

const BusinessInfoPage = (routeObject) => {
	// Access the user context
	const userContext = useContext(UserContext);
	const navigation = useNavigation();
	const [stylistData, setStylistData] = useState(null);
	const [editable, setEditable] = useState(true);
	const [photoChanged, setPhotoChanged] = useState(false);

	useEffect(() => {
		setEditable(userContext.username == routeObject.route.params.username);
		populateStylistData(routeObject.route.params.username);
	}, [routeObject, photoChanged]);

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

			<ProfilePhotoDisplay
				profilePhoto={stylistData.profilePhoto}
			></ProfilePhotoDisplay>

			{stylistData.username == userContext.username && (
				<ImageUploadButton
					username={userContext.username}
					photoChanged={photoChanged}
					setPhotoChanged={setPhotoChanged}
				></ImageUploadButton>
			)}

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
				<Button
					style={{ marginBottom: 50 }}
					onPress={() => navigation.goBack()}
				>
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
