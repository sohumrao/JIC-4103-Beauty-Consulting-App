import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { UserContext } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import handleHTTPError from "utils/errorHandling";
import { formatDate } from "utils/utils";
import StylistServices from "../components/StylistServices";
import ImageUploadButton from "../assets/components/ImageUploadButton";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay"; // Import the component

const BusinessInfoPage = ({ route }) => {
	const { username } = route.params;
	const {
		username: contextUsername,
		role,
		profilePhoto,
		updateUserContext,
	} = useContext(UserContext);
	const navigation = useNavigation();
	const [stylistData, setStylistData] = useState(null);
	const [editable, setEditable] = useState(true);
	const [photoChanged, setPhotoChanged] = useState(false);

	useEffect(() => {
		setEditable(contextUsername === username);
		populateStylistData(username);
	}, [username, contextUsername, photoChanged]);

	const populateStylistData = async (username) => {
		try {
			const res = await api.get(`/stylist/${username}`);
			setStylistData(res.data);

			// Update UserContext if the fetched stylist is the current user
			if (contextUsername === username) {
				updateUserContext({
					profilePhoto: res.data.profilePhoto || null,
				});
			}
		} catch (error) {
			handleHTTPError(error);
		}
	};

	if (!stylistData) {
		return (
			<SignupBackground>
				<View style={globalStyles.box}>
					<Text style={globalStyles.promptText}>Loading...</Text>
				</View>
			</SignupBackground>
		);
	}

	return (
		<SignupBackground>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Header Bar */}
					<View style={styles.headerBar}>
						{/* Profile Photo */}
						<ProfilePhotoDisplay
							profilePhoto={profilePhoto}
							styleProp={styles.profilePhoto}
						/>
						{/* Title */}
						<Text style={styles.headerTitle}>Business Info</Text>
						{/* Placeholder for balancing the header layout */}
						<View style={styles.headerRightPlaceholder} />
					</View>
					{/* End of Header Bar */}

					{/* Main Content */}
					<ScrollView>
						<Text style={styles.header}>
							{stylistData.business.name}
						</Text>

						<ProfilePhotoDisplay
							profilePhoto={stylistData.profilePhoto}
							styleProp={styles.photo}
						/>

						{stylistData.username === contextUsername && (
							<ImageUploadButton
								username={contextUsername}
								photoChanged={photoChanged}
								setPhotoChanged={setPhotoChanged}
							/>
						)}

						{/* White Boxes Around Fields */}
						<View style={styles.whiteBox}>
							<Text style={styles.label}>Stylist Name:</Text>
							<Text style={styles.value}>
								{stylistData.info.name}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>Business Address:</Text>
							<Text style={styles.value}>
								{stylistData.business.address}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>Birthday:</Text>
							<Text style={styles.value}>
								{formatDate(stylistData.info.birthday)}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>Phone Number:</Text>
							<Text style={styles.value}>
								{stylistData.info.phoneNumber}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>
								Years of Experience:
							</Text>
							<Text style={styles.value}>
								{stylistData.business.experience}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>Specialty:</Text>
							<Text style={styles.value}>
								{stylistData.business.specialty}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<Text style={styles.label}>Additional Info:</Text>
							<Text style={styles.value}>
								{stylistData.business.additionalInfo}
							</Text>
						</View>

						<View style={styles.whiteBox}>
							<StylistServices
								stylistData={stylistData}
								setStylistData={setStylistData}
								editable={editable}
							/>
						</View>

						{role === "client" && (
							<Button
								style={{ marginBottom: 50 }}
								onPress={() => navigation.goBack()}
							>
								Back to Directory
							</Button>
						)}
					</ScrollView>
				</View>
			</SafeAreaView>
		</SignupBackground>
	);
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 20,
	},
	headerBar: {
		height: 60,
		width: "100%",
		backgroundColor: "#fa4e41",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		marginBottom: 10,
	},
	profilePhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
	},
	placeholderPhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#555",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRightPlaceholder: {
		width: 40,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	whiteBox: {
		backgroundColor: "#fff",
		padding: 15,
		marginVertical: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
	},
	value: {
		fontSize: 16,
		color: "#555",
	},
	photo: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5,
		borderRadius: (screenWidth * 0.5) / 2,
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
	},
});

export default BusinessInfoPage;
