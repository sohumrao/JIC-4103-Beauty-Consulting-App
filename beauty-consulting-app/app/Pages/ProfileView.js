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
import Loading from "../components/Loading";
import { clientSchema } from "../../../shared/schemas";

const ProfileView = ({ route }) => {
	const { username } = route.params;
	const navigation = useNavigation();
	const userContext = useContext(UserContext);
	const [editable, setEditable] = useState(true);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [photoChanged, setPhotoChanged] = useState(false);

	useEffect(() => {
		fetchProfile(username);
		setEditable(userContext.username === username);
		if (profile && editable) {
			userContext.updateUserContext({
				profilePhoto: profile.profilePhoto || null,
			});
		}
	}, [userContext.username, username]);

	const fetchProfile = async (username) => {
		setLoading(true);
		try {
			const { data } = await api.get(`/client/${username}`);
			const validatedData = await clientSchema.validateAsync(data);
			setProfile(validatedData);
			setLoading(false);
		} catch (error) {
			handleHTTPError(error);
		}
	};

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
					{userContext.profilePhoto ? (
						<ProfilePhotoDisplay
							styleProp={styles.profilePhoto}
							profilePhoto={userContext.profilePhoto}
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
								profilePhoto={userContext.profilePhoto}
								styleProp={styles.photo}
							/>

							{editable && (
								<ImageUploadButton
									username={userContext.username}
									photoChanged={photoChanged}
									setPhotoChanged={setPhotoChanged}
								/>
							)}
						</View>
						{!loading ? (
							<View>
								<AboutMeBox
									profile={profile}
									editable={editable}
									onEdit={() =>
										navigation.navigate("Edit Profile", {
											profile,
											refetchProfile: () =>
												fetchProfile(username),
										})
									}
								/>
							</View>
						) : (
							<Loading />
						)}
					</View>
					{editable && (
						<TouchableOpacity
							style={[
								globalStyles.button,
								{ borderWidth: 2, borderColor: "white" },
							]}
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
