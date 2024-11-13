import React, { useState } from "react";
import { Image, Dimensions } from "react-native";
import globalStyles from "../GlobalStyles";
import { StyleSheet } from "react-native";

const ProfilePhotoDisplay = ({ profilePhoto, styleProp }) => {
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
			style={styleProp}
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

export default ProfilePhotoDisplay;
