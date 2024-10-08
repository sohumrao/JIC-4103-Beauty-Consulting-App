import React, { useState } from "react";
import { View, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileImage = () => {
	const [imageUri, setImageUri] = useState(null);

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			Alert.alert("Error");
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
		}
	};
	//to do: send imageUri to backend
	return (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			<Button title="Picture Test" onPress={pickImage} />
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
