import React, { useState, useContext } from "react";
import { View, Button, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { UserContext } from "beauty-consulting-app/app/contexts/userContext.js";
import Constants from "expo-constants";

const ProfileImage = ({ username }) => {
	const [imageUri, setImageUri] = useState(null);
	const userContext = useContext(UserContext);

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
				type: "image/jpeg", // Adjust MIME type if necessary
				name: "profile_photo.jpg",
			});

			const apiUrl =
				Constants.manifest?.extra?.apiUrl ||
				process.env.EXPO_PUBLIC_API_URL;
			if (!apiUrl) {
				console.error("apiURL not defined");
				return;
			}

			await axios.post(`${apiUrl}:5050/account/photo`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			Alert.alert("Success", "Photo uploaded successfully!");

			// Fetch the updated profile picture
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
			const apiUrl =
				Constants.manifest?.extra?.apiUrl ||
				process.env.EXPO_PUBLIC_API_URL;
			if (!apiUrl) {
				console.error("apiURL not defined");
				return;
			}

			const endpoint = `${apiUrl}:5050/account/${username}/photo`;
			const response = await axios.get(endpoint, {
				responseType: "arraybuffer",
			});

			// Convert binary data to base64
			const base64 = Buffer.from(response.data, "binary").toString(
				"base64"
			);
			const contentType = response.headers["content-type"];
			const dataUri = `data:${contentType};base64,${base64}`;

			// Update the UserContext with the new profile picture
			userContext.updateUserContext({
				business: {
					...userContext.business,
					profilePhoto: dataUri,
				},
			});
		} catch (error) {
			console.error("Error fetching updated profile picture:", error);
			// Optionally handle errors (e.g., set a default image)
		}
	};

	return (
		<View style={styles.container}>
			<Button title="Upload Profile Picture" onPress={pickImage} />
			{imageUri && (
				<Image source={{ uri: imageUri }} style={styles.image} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		alignItems: "center",
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 100,
		marginTop: 20,
	},
});

export default ProfileImage;
