import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../assets/GlobalStyles";

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
		navigation.navigate("BusinessInfoPage", {
			stylistUsername: username,
		});
	};
	var bookedAlready = false;
	if (booked) {
		bookedAlready = booked.indexOf(username) > -1;
	}

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

export default StylistListing;
