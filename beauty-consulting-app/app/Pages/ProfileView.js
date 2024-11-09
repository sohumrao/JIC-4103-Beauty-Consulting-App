// ProfileView.js
import React, { useContext, useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Modal,
	TextInput,
	Alert,
	ActivityIndicator,
	Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import AboutMeBox from "../assets/components/AboutMeBox";
import AboutHairBox from "../assets/components/AboutHairBox";
import ProfileImage from "../assets/components/ProfileImage";
import axios from "axios";
import Constants from "expo-constants";

const ProfileView = () => {
	const navigation = useNavigation();
	const userContext = useContext(UserContext);

	// State variables for editing user information
	const [isEdit, setIsEdit] = useState(false);
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [allergies, setAllergies] = useState("");
	const [concerns, setConcerns] = useState("");
	const [loading, setLoading] = useState(false);

	// State for Delete Account Confirmation Modal
	const [modalVisible, setModalVisible] = useState(false);

	// Function to handle editing user information
	const handleEdit = async () => {
		// Initialize fields with current user data if entering edit mode
		if (!isEdit) {
			setName(userContext.name);
			setAge(userContext.age ? userContext.age.toString() : "");
			setGender(userContext.gender);
			setPhoneNumber(userContext.phoneNumber);
			setAllergies(userContext.allergies);
			setConcerns(userContext.concerns);
		}

		// Toggle edit mode
		setIsEdit(!isEdit);

		if (isEdit) {
			// When exiting edit mode, submit the changes
			await submitEdit();
		}
	};

	// Function to submit the edited user information
	const submitEdit = async () => {
		// Preserve existing values if new values are empty
		const updatedName = name !== "" ? name : userContext.name;
		const updatedGender = gender !== "" ? gender : userContext.gender;
		const updatedAllergies =
			allergies !== "" ? allergies : userContext.allergies;
		const updatedConcerns =
			concerns !== "" ? concerns : userContext.concerns;

		setLoading(true);

		const req = {
			username: userContext.username,
			name: updatedName,
			age: userContext.age, // Assuming age is not editable here
			gender: updatedGender,
			phoneNumber: userContext.phoneNumber, // Assuming phoneNumber is not editable here
			email: userContext.email, // Assuming email is not editable here
			hairDetails: userContext.hairDetails, // Assuming hairDetails are handled elsewhere
			allergies: updatedAllergies,
			concerns: updatedConcerns,
		};

		try {
			const apiURL =
				Constants.manifest?.extra?.apiUrl ||
				process.env.EXPO_PUBLIC_API_URL;
			if (!apiURL) {
				console.error("apiURL not defined");
				Alert.alert("Error", "API URL is not defined.");
				setLoading(false);
				return;
			}
			const res = await axios.put(
				`${apiURL}/client/${userContext.username}`,
				req
			);
			console.log("update successful: ", res.data);

			// Update UserContext with the new information
			userContext.updateUserContext({
				username: userContext.username,
				name: updatedName,
				age: userContext.age,
				gender: updatedGender,
				phoneNumber: userContext.phoneNumber,
				email: userContext.email,
				hairDetails: userContext.hairDetails,
				allergies: updatedAllergies,
				concerns: updatedConcerns,
			});

			Alert.alert("Success", "Profile updated successfully.");
		} catch (error) {
			console.error("Error with request: ", error);
			Alert.alert(
				"Error",
				"Failed to update profile. Please try again later."
			);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle account deletion
	const deleteAccount = async () => {
		// TODO: update with a separate flow for password validation after backend rework

		setLoading(true);

		try {
			console.log(userContext);
			const apiURL =
				Constants.manifest?.extra?.apiUrl ||
				process.env.EXPO_PUBLIC_API_URL;
			if (!apiURL) {
				console.error("apiURL not defined");
				Alert.alert("Error", "API URL is not defined.");
				setLoading(false);
				return;
			}
			const res = await axios.delete(
				`${apiURL}/client/${userContext.username}`
			);
			console.log(res.message);
			Alert.alert(
				"Account Deleted",
				"Your account has been successfully deleted.",
				[
					{
						text: "OK",
						onPress: () => navigation.navigate("Sign In"),
					},
				]
			);
		} catch (error) {
			console.error("Error with request: ", error);
			Alert.alert(
				"Error",
				"Failed to delete account. Please try again later."
			);
		} finally {
			setLoading(false);
			setModalVisible(false);
		}
	};

	// Function to fetch user data on component mount (optional)
	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const apiURL =
					Constants.manifest?.extra?.apiUrl ||
					process.env.EXPO_PUBLIC_API_URL;
				if (!apiURL) {
					console.error("apiURL not defined");
					Alert.alert("Error", "API URL is not defined.");
					setLoading(false);
					return;
				}
				const res = await axios.get(
					`${apiURL}/client/${userContext.username}`
				);
				userContext.updateUserContext(res.data);
			} catch (error) {
				// console.error("Error fetching user data: ", error);
				// Alert.alert("Error", "Failed to fetch user data.");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	return (
		<SignupBackground>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container}>
					{/* Profile Picture and Image Upload */}
					<View style={styles.profilePictureContainer}>
						{userContext.profilePhoto ? (
							<Image
								source={{ uri: userContext.profilePhoto }}
								style={styles.profileImage}
							/>
						) : (
							<Image
								source={require("../assets/images/profile-user.svg")} // Path to a default image
								style={styles.profileImage}
							/>
						)}
						<ProfileImage username={userContext.username} />
					</View>

					{/* About Me Section */}
					<View style={styles.aboutMeContainer}>
						<AboutMeBox
							userContext={userContext}
							onUpdateUser={(updatedUser) =>
								userContext.updateUserContext(updatedUser)
							}
						/>
					</View>

					{/* About Hair Section */}
					<View style={styles.aboutHairContainer}>
						<AboutHairBox
							hairDetails={userContext.hairDetails}
							allergies={userContext.allergies}
							concerns={userContext.concerns}
						/>
					</View>

					{/* Edit and Delete Buttons */}
					<View style={styles.buttonsContainer}>
						{/* Edit Profile Button */}
						<TouchableOpacity
							style={styles.editButton}
							onPress={handleEdit}
						>
							<Text style={styles.editButtonText}>
								{isEdit ? "Save Changes" : "Edit Profile"}
							</Text>
						</TouchableOpacity>

						{/* Show Cancel Button in Edit Mode */}
						{isEdit && (
							<TouchableOpacity
								style={[
									styles.editButton,
									{ backgroundColor: "#9E9E9E" },
								]}
								onPress={() => setIsEdit(false)}
							>
								<Text style={styles.editButtonText}>
									Cancel
								</Text>
							</TouchableOpacity>
						)}

						{/* Delete Account Button */}
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => setModalVisible(true)}
						>
							<Text style={styles.deleteButtonText}>
								Delete Account
							</Text>
						</TouchableOpacity>
					</View>

					{/* Loading Indicator */}
					{loading && (
						<View style={styles.loader}>
							<ActivityIndicator size="large" color="#0000ff" />
						</View>
					)}

					{/* Delete Confirmation Modal */}
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalText}>
									Are you sure you want to delete your
									account? This action cannot be undone.
								</Text>
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.modalButton,
											styles.modalButtonCancel,
										]}
										onPress={() => setModalVisible(false)}
									>
										<Text style={styles.modalButtonText}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.modalButton,
											styles.modalButtonDelete,
										]}
										onPress={deleteAccount}
									>
										<Text style={styles.modalButtonText}>
											Delete
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				</View>
			</ScrollView>
		</SignupBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		width: "100%",
		alignItems: "center", // Center align items horizontally
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
	},
	profilePictureContainer: {
		alignItems: "center",
		marginTop: 20,
	},
	profileImage: {
		width: 200,
		height: 200,
		borderRadius: 100,
		marginBottom: 20,
	},
	aboutMeContainer: {
		width: "100%",
		marginTop: 20,
	},
	aboutHairContainer: {
		width: "100%",
		marginTop: 20,
	},
	buttonsContainer: {
		width: "100%",
		alignItems: "center",
		marginTop: 30,
	},
	editButton: {
		backgroundColor: "#4CAF50",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		alignItems: "center",
		width: "80%", // Make buttons uniform in width
	},
	editButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	deleteButton: {
		backgroundColor: "#f44336",
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
		alignItems: "center",
		width: "80%", // Make buttons uniform in width
	},
	deleteButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	modalButton: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		alignItems: "center",
	},
	modalButtonCancel: {
		backgroundColor: "#9E9E9E",
	},
	modalButtonDelete: {
		backgroundColor: "#f44336",
	},
	modalButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	loader: {
		marginTop: 20,
	},
});

export default ProfileView;
