import React, { useContext, useEffect, useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	Modal,
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
	}, [userContext.username, username, photoChanged]);

	const fetchProfile = async (username) => {
		setLoading(true);
		try {
			const { data } = await api.get(`/client/${username}`);
			const validatedData = await clientSchema.validateAsync(data);
			setProfile(validatedData);
			if (username === userContext.username) {
				userContext.updateUserContext({
					profilePhoto: validatedData?.profilePhoto || null,
				});
			}
			setLoading(false);
		} catch (error) {
			handleHTTPError(error);
		}
	};
	const [modalVisible, setModalVisible] = useState(false);

	const deleteAccount = async () => {
		try {
			await api.delete(`/client/${userContext.username}`);
			setModalVisible(false);
			navigation.navigate("Sign In");
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return !loading ? (
		<SignupBackground>
			<View style={styles.safeArea}>
				<View style={styles.headerBar}>
					<ProfilePhotoDisplay
						styleProp={styles.profilePhoto}
						profilePhoto={userContext.profilePhoto}
					/>
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
					</View>
					{editable && (
						<TouchableOpacity
							style={[
								globalStyles.button,
								{ borderWidth: 2, borderColor: "white" },
							]}
							onPress={() => setModalVisible(true)}
						>
							<Text style={globalStyles.buttonText}>
								Delete Account
							</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
				<Modal
					visible={modalVisible}
					transparent={true} // Allows overlay effect
					animationType="fade" // Smooth transition
				>
					<View style={globalStyles.modalOverlay}>
						<View style={globalStyles.modalContent}>
							<Text style={globalStyles.modalTitle}>
								Delete Account
							</Text>
							<Text style={globalStyles.modalText}>
								Are you sure you want to delete your account?
							</Text>
							<View style={globalStyles.modalButtonContainer}>
								<TouchableOpacity
									style={[
										globalStyles.button,
										{
											backgroundColor: "#808080",
											width: "45%",
										},
									]}
									onPress={() => {
										setModalVisible(false);
									}}
								>
									<Text style={globalStyles.buttonText}>
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										globalStyles.button,
										{ width: "45%" },
									]}
									onPress={deleteAccount}
								>
									<Text style={globalStyles.buttonText}>
										Yes
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</SignupBackground>
	) : (
		<Loading />
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
