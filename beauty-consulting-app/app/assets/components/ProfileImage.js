import React, { useState } from "react";
import { View, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";


const ProfileImage = ({ username }) => {
	const [imageUri, setImageUri] = useState(null);

	const pickImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
			setImageUri(result.assets[0].uri);
			uploadImage(result.assets[0].uri);
		}
	};

	const uploadImage = async (uri) => {
		try {
			const formData = new FormData();
			formData.append("username", username);
			formData.append("photo", {
				uri: uri,
				type: "image/jpeg", // Use the correct MIME type if known
				name: "profile_photo.jpg",
			});
	
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL + ":5050/client/photo";
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}
			await axios.post(apiURL, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
	
			Alert.alert("Success", "Photo uploaded successfully!");
		} catch (error) {
			console.error("Error uploading image: ", error.response ? error.response.data : error.message);
			Alert.alert("Upload failed", "There was an error uploading the photo.");
		}
	};
	

	return (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			<Button title="Upload Profile Picture" onPress={pickImage} />
			{imageUri && (
				<Image
					source={{ uri: imageUri }}
					style={{
						width: 200,
						height: 200,
						borderRadius: 100,
						marginTop: 20,
					}}
				/>
			)}
		</View>
	);
};

export default ProfileImage;
