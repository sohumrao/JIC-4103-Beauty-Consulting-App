import React, { useState } from "react";
import { Image, Dimensions } from "react-native";
import globalStyles from "../GlobalStyles";
import { StyleSheet } from "react-native";

const ProfilePhotoDisplay = ({ profilePhoto }) => {
	// Method to convert profile data from byte array
	const arrayToBase64 = (byteArray) => {
		// Convert the array of integers to a Uint8Array
		const uint8Array = new Uint8Array(byteArray);
		// Create a binary string from the Uint8Array
		const binaryString = String.fromCharCode(...uint8Array);
		// Convert the binary string to base64
		return btoa(binaryString);
	};

	return (
		<Image
			style={styles.photo}
			source={
				profilePhoto?.data
					? {
							uri: `data:${profilePhoto?.contentType};base64,${arrayToBase64(profilePhoto?.data.data)}`,
						}
					: require("../../assets/images/placeholder.png")
			}
			resizeMode="cover"
		/>
	);
};

// Default styling, dynamically allocates dimensions relative to screen size
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	photo: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5, // Ensures height is equal to width
		borderRadius: (screenWidth * 0.5) / 2, // Half of the width for a perfect circle
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
	},
});

export default ProfilePhotoDisplay;
