import React, { useState } from "react";
import { View, Image, Alert, TouchableOpacity, Text } from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import globalStyles from "../assets/GlobalStyles";

const PhotoUpload = () => {
	const [photo, setPhoto] = useState(null);

	const pickImage = async () => {
		launchImageLibrary({ mediaType: "photo" }, (response) => {
			if (response.didCancel) {
				console.log("User cancelled image picker");
			} else if (response.error) {
				console.log("ImagePicker Error: ", response.error);
			} else if (response.assets && response.assets.length > 0) {
				setPhoto(response.assets[0]);
			}
		});
	};

	const uploadPhoto = async () => {
		if (!photo) {
			Alert.alert("Please select a photo first.");
			return;
		}

		const formData = new FormData();
		formData.append("photo", {
			uri: photo.uri,
			type: photo.type,
			name: photo.fileName,
		});

		try {
			const response = await axios.post(
				"http://localhost:3000/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			Alert.alert("Success", "Photo uploaded successfully!");
		} catch (error) {
			console.log(error);
			Alert.alert("Upload failed", "Failed to upload the photo.");
		}
	};

	return (
		<View style={globalStyles.container}>
			<TouchableOpacity style={globalStyles.button} onPress={pickImage}>
				<Text style={globalStyles.buttonText}>Pick an Image</Text>
			</TouchableOpacity>
			{photo && (
				<Image
					source={{ uri: photo.uri }}
					style={{ width: 200, height: 200, marginTop: 20 }}
				/>
			)}
			<TouchableOpacity
				style={[globalStyles.button, { marginTop: 20 }]} // Adding marginTop to separate buttons
				onPress={uploadPhoto}
				disabled={!photo}
			>
				<Text style={globalStyles.buttonText}>Upload Photo</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PhotoUpload;
