import React from "react";
import {
	Text,
	View,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../assets/GlobalStyles";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";

const StylistListing = ({
	stylistName,
	businessName,
	businessAddress,
	profilePicture,
	mostSimilarHairDetails,
	username,
	booked,
	handleBookingPress,
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

	const navigation = useNavigation();

	const handleMoreInfoPress = () => {
		navigation.navigate("BusinessInfoPage", { username });
	};
	var bookedAlready = false;
	if (booked) {
		bookedAlready = booked.indexOf(username) > -1;
	}

	return (
		<View style={globalStyles.stylistListingContainer}>
			<ProfilePhotoDisplay
				profilePhoto={profilePicture}
				styleProp={styles.photo}
			></ProfilePhotoDisplay>
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
				<TouchableOpacity
					style={[globalStyles.button, { marginTop: 10 }]}
					onPress={handleMoreInfoPress}
				>
					<Text style={globalStyles.buttonText}>More Info</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						globalStyles.button,
						{ marginTop: 10 },
						bookedAlready && { backgroundColor: "#CCC" },
					]}
					onPress={bookedAlready ? null : handleBookingPress}
				>
					<Text style={globalStyles.buttonText}>
						{bookedAlready ? "Booked!" : "Book Now"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	photo: {
		width: screenWidth * 0.35,
		height: screenWidth * 0.35, // Ensures height is equal to width
		borderRadius: (screenWidth * 0.5) / 2, // Half of the width for a perfect circle
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
		marginRight: 15,
	},
});

export default StylistListing;
