import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import globalStyles from "../assets/GlobalStyles";
import StylistListing from "../components/StylistListing";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "../errorHandling";

const Directory = () => {
	const navigation = useNavigation();
	var userContext = useContext(UserContext);

	var [stylistData, setStylistData] = useState(null);

	useEffect(() => {
		retrieveStylistData();
	}, [userContext.username]);

	const retrieveStylistData = async () => {
		try {
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL +
				":5050/client/matchStylists/" +
				userContext.username;
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}

			const res = await axios.get(apiURL);
			console.log(res.data);
			setStylistData(res.data);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	const handleListingPress = (stylistUsername) => {
		console.log(stylistUsername);
		navigation.navigate("BusinessInfoPage", {
			stylistUsername: stylistUsername,
		});
	};

	if (!stylistData) {
		return (
			<View style={globalStyles.box}>
				<Text style={globalStyles.promptText}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={globalStyles.container}>
			<View style={globalStyles.directoryHeaderContainer}>
				<Text style={globalStyles.directoryHeaderText}>
					Stylists for You
				</Text>
			</View>
			<ScrollView style={globalStyles.directoryContainer}>
				{stylistData.map((stylist) => (
					<TouchableOpacity
						key={stylist.username}
						onPress={() => handleListingPress(stylist.username)}
					>
						<StylistListing
							profilePicture={stylist.profilePicture}
							stylistName={stylist.name}
							businessName={stylist.businessName}
							businessAddress={stylist.businessAddress}
							mostSimilarHairDetails={
								stylist.mostSimilarHairDetails
							}
						/>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

export default Directory;
