import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "utils/axios";
import globalStyles from "../GlobalStyles";
import EditImage from "../images/pen.svg";
import { StyleSheet } from "react-native";

const ImageUploadButton = ({ username, photoChanged, setPhotoChanged }) => {
	const [imageUri, setImageUri] = useState(null);

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

			await api.post("/account/photo", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setPhotoChanged(!photoChanged);
			Alert.alert("Success", "Photo uploaded successfully!");
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

	return (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			<TouchableOpacity
				style={[
					globalStyles.button,
					{
						flex: 1,
						flexDirection: "row",
						marginTop: 10,
						marginBottom: 10,
						paddingLeft: 10,
						paddingRight: 10,
					},
				]}
				onPress={pickImage}
			>
				<Text style={[globalStyles.buttonText, { marginRight: 10 }]}>
					Edit Profile Image
				</Text>
				<EditImage
					width={12}
					height={12}
					fill={"white"}
					style={styles.editIcon}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	editIcon: {
		height: 24,
		width: 2,
	},
});

export default ImageUploadButton;
