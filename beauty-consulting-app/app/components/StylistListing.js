import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	Pressable,
	Button,
} from "react-native";
import { Card } from "react-native-paper";
import { Link, useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import axios from "axios";
import ContinueButton from "../assets/components/ContinueButton";

const StylistListing = ({
	stylistName,
	businessName,
	businessAddress,
	profilePicture,
	mostSimilarHairDetails,
}) => {
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
		<View style={globalStyles.stylistListingContainer}>
			<Image
				style={globalStyles.stylistImage}
				source={
					profilePicture?.data
						? {
								uri: `data:${profilePicture?.contentType};base64,${arrayToBase64(profilePicture?.data)}`,
							}
						: require("../assets/images/placeholder.png")
				}
				resizeMode="cover"
			/>
			<View style={globalStyles.listingTextContainer}>
				<Text style={globalStyles.stylistName}>{stylistName}</Text>
				<Text style={globalStyles.businessName}>{businessName}</Text>
				<Text style={globalStyles.businessAddress}>
					{businessAddress}
				</Text>
				<Text style={globalStyles.businessAddress}>
					Experienced with hair that is:{" "}
					{Object.keys(mostSimilarHairDetails).join(", ")}
				</Text>
			</View>
			<View></View>
		</View>
	);
};

export default StylistListing;
