import React from "react";
import { Image, View } from "react-native";
import { Buffer } from "buffer"; // Import Buffer
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfilePhotoDisplay = ({ profilePhoto, styleProp }) => {
	// Convert byte array to base64 string using Buffer
	const arrayToBase64 = (byteArray) => {
		if (!byteArray) return null;
		return Buffer.from(byteArray).toString("base64");
	};

	// Determine if profilePhoto is a base64 string or an object with data
	if (profilePhoto?.data && profilePhoto?.contentType) {
		const base64String = arrayToBase64(profilePhoto.data.data);
		return (
			<Image
				style={styleProp}
				source={{
					uri: `data:${profilePhoto.contentType};base64,${base64String}`,
				}}
				resizeMode="cover"
			/>
		);
	} else if (
		typeof profilePhoto === "string" &&
		profilePhoto.startsWith("data:")
	) {
		// If it's already a base64 string with data URI
		return (
			<Image
				style={styleProp}
				source={{ uri: profilePhoto }}
				resizeMode="cover"
			/>
		);
	} else if (typeof profilePhoto === "string") {
		// If it's a URL
		return (
			<Image
				style={styleProp}
				source={{ uri: profilePhoto }}
				resizeMode="cover"
			/>
		);
	} else {
		// Placeholder
		return (
			<View style={[styleProp, styles.placeholderPhoto]}>
				<Ionicons name="person" size={24} color="#fff" />
			</View>
		);
	}
};

const styles = {
	placeholderPhoto: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#555",
	},
};

export default ProfilePhotoDisplay;
