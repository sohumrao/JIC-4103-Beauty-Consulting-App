import React, { useContext, useEffect, useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import AboutMeBox from "../assets/components/AboutMeBox";
import handleHTTPError from "utils/errorHandling";
import globalStyles from "../assets/GlobalStyles";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";
import ImageUploadButton from "../assets/components/ImageUploadButton";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileView = ({ route }) => {
	const { username } = route.params;
	const navigation = useNavigation();
	const userContext = useContext(UserContext);
	const [editable, setEditable] = useState(true);
	const [profileDetails, setProfileDetails] = useState({
		birthday: "",
		gender: "",
		phoneNumber: "",
		email: "",
	});
	const [hairProfile, setHairProfile] = useState({
		hairDetails: {},
		allergies: "",
		concerns: "",
	});
	const [photoChanged, setPhotoChanged] = useState(false);

	const fetchDetails = async (username) => {
		try {
			const res = await api.get(`/client/${username}`);
			const updatedProfileDetails = {
				birthday: res.data?.info?.birthday || "",
				gender: res.data?.info?.gender || "",
				phoneNumber: res.data?.info?.phoneNumber || "",
				email: res.data?.email || "",
				profilePhoto: res.data?.profilePhoto || null,
				username: res.data?.username,
			};
			setProfileDetails(updatedProfileDetails);

			setHairProfile({
				hairDetails: res.data?.hairDetails || {},
				allergies: res.data?.allergies || "",
				concerns: res.data?.concerns || "",
			});

			if (userContext.username === username) {
				userContext.updateUserContext({
					profilePhoto: res.data?.profilePhoto || null,
				});
			}
		} catch (error) {
			handleHTTPError(error);
		}
	};

	useEffect(() => {
		setEditable(userContext.username === username);
		fetchDetails(username);
	}, [userContext.username, username, photoChanged]);

	const deleteAccount = async () => {
		try {
			await api.delete(`/client/${userContext.username}`);
			navigation.navigate("Sign In");
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<SignupBackground>
			<View style={styles.safeArea}>
				<View style={styles.headerBar}>
					{profileDetails.profilePhoto ? (
						<ProfilePhotoDisplay
							styleProp={styles.profilePhoto}
							profilePhoto={profileDetails.profilePhoto}
						/>
					) : (
						<View style={styles.placeholderPhoto}>
							<Ionicons name="person" size={24} color="#fff" />
						</View>
					)}
					<Text style={styles.headerTitle}>Profile</Text>
					<View style={styles.headerRightPlaceholder} />
				</View>

				<ScrollView>
					<View style={{ flex: 1 }}>
						<View style={{ marginTop: 20 }}>
							<ProfilePhotoDisplay
								profilePhoto={profileDetails.profilePhoto}
								styleProp={styles.photo}
							/>

							{profileDetails.username ===
								userContext.username && (
								<ImageUploadButton
									username={userContext.username}
									photoChanged={photoChanged}
									setPhotoChanged={setPhotoChanged}
								/>
							)}
						</View>
						<View>
							<AboutMeBox
								fieldValues={profileDetails}
								hairProfile={hairProfile}
								onEdit={() =>
									navigation.navigate("Edit Profile", {
										profileDetails,
										setProfileDetails,
									})
								}
							/>
						</View>
					</View>
					{profileDetails.username === userContext.username && (
						<TouchableOpacity
							style={globalStyles.button}
							onPress={deleteAccount}
						>
							<Text style={globalStyles.buttonText}>
								Delete Account
							</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>
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
		width: 350,
		backgroundColor: "#fa4e41",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderRadius: 8,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		marginTop: 60,
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
		width: 40, // To balance the header layout
	},
	photo: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5, // Ensures height is equal to width
		borderRadius: (screenWidth * 0.5) / 2, // Half of the width for a perfect circle
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
	},
});

export default ProfileView;
