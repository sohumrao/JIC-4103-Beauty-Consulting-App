import React, { useState, useContext } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	Image,
	Alert,
	StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "utils/axios";
import { UserContext } from "../../contexts/userContext"; // Adjust the path as necessary

const ProfileImage = ({ username }) => {
	const [imageUri, setImageUri] = useState(null);
	const userContext = useContext(UserContext); // Access UserContext

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			Alert.alert("Permission to access media library is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			const selectedUri = result.assets[0].uri;
			setImageUri(selectedUri);
			uploadImage(selectedUri);
		}
	};

	const uploadImage = async (uri) => {
		try {
			const formData = new FormData();
			formData.append("username", username);
			formData.append("photo", {
				uri: uri,
				type: "image/jpeg",
				name: "profile_photo.jpg",
			});

			await api.post("/account/photo", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			fetchProfilePicture();
		} catch (error) {
			console.error(
				"Error uploading image: ",
				error.response ? error.response.data : error.message
			);
			Alert.alert(
				"Upload failed",
				"There was an error uploading the photo."
			);
		}
	};

	const fetchProfilePicture = async () => {
		try {
			const response = await api.get(`/account/${username}/photo`, {
				responseType: "arraybuffer",
			});

			const base64 = Buffer.from(response.data, "binary").toString(
				"base64"
			);
			const contentType = response.headers["content-type"];
			const dataUri = `data:${contentType};base64,${base64}`;

			userContext.updateUserContext({
				profilePhoto: dataUri,
			});
		} catch (error) {
			// console.error("Error fetching updated profile picture:", error);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
				<Text style={styles.uploadButtonText}>
					Upload Profile Picture
				</Text>
			</TouchableOpacity>
			{imageUri && (
				<Image source={{ uri: imageUri }} style={styles.image} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: -200,
		alignItems: "center",
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 100,
		marginTop: 20,
	},
	uploadButton: {
		backgroundColor: "#2196F3", // Blue color
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
		alignItems: "center",
		width: "80%", // Make button uniform in width
	},
	uploadButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ProfileImage;
