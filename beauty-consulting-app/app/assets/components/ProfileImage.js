import React, { useState } from "react";
import { View, Button, Image, Alert } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import axios from "axios";

const ProfileImage = ({ username }) => {
	const [imageUri, setImageUri] = useState(null);

	// Function to pick, resize, and compress the image
	const pickImage = async () => {
		try {
			// Open image picker with cropping and compression options
			ImagePicker.openPicker({
				width: 500, // Resize the image width to 500px
				height: 500, // Resize the image height to 500px
				cropping: true, // Enable cropping
				compressImageQuality: 0.7, // Compress to 70% quality
			}).then((image) => {
				// Set the image URI and upload the resized and compressed image
				setImageUri(image.path);
				uploadImage(image.path);
			}).catch((error) => {
				console.error("Error selecting image: ", error);
				Alert.alert("Error", "There was an error selecting the image.");
			});
		} catch (error) {
			console.error("Error launching image picker: ", error);
			Alert.alert("Error", "Image picker failed to open.");
		}
	};

	// Function to upload the image to the backend
	const uploadImage = async (uri) => {
		try {
			const formData = new FormData();
			formData.append("username", username);
			formData.append("photo", {
				uri: uri,
				type: "image/jpeg", // Set the image type as jpeg
				name: "profile_photo.jpg", // Filename to send to backend
			});

			// Set the backend API URL
			const apiURL = "http://your-local-ip-address:5050/client/photo";

			// Send a POST request with the form data to the backend
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
