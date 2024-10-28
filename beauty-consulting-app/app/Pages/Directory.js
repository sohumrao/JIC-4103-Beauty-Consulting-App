import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import globalStyles from "../assets/GlobalStyles";
import StylistListing from "../components/StylistListing";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "../errorHandling.js";
import { getCityFromZIP } from "../geocoding.js";

const Directory = () => {
	const navigation = useNavigation();
	var userContext = useContext(UserContext);
	const [city, setCity] = useState("Atlanta"); //TODO: change default value once location-based search is implemented
	var [stylistData, setStylistData] = useState(null);
	var [zipCode, setZipCode] = useState("30332");

	useEffect(() => {
		retrieveStylistData(city);
	}, [userContext.username, city]);

	const retrieveStylistData = async (city) => {
		try {
			req = {
				username: userContext.username,
				distance: dropDownValue,
				city: city,
			};
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL +
				":5050/client/matchStylists/" +
				userContext.username;
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}

			const res = await axios.post(apiURL, req);
			// console.log(res.data); // // clogs up console quite a bit
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

	const refreshSearch = async () => {
		try {
			const locationResponse = await getCityFromZIP(zipCode);
			setCity(locationResponse.city);
			retrieveStylistData(city);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	const dropDownData = [
		{ label: "10 miles", value: 10 },
		{ label: "20 miles", value: 20 },
		{ label: "50 miles", value: 50 },
	];

	const [dropDownValue, setDropDownValue] = useState(dropDownData[0].value);

	const styles = StyleSheet.create({
		container: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 8,
			marginTop: 8,
		},
		dropDown: {
			flex: 1,
			borderColor: "#ccc",
			borderWidth: 1,
			fontSize: 16,
			padding: 10,
			marginLeft: 8,
			marginRight: 8,
			borderRadius: 5,
		},
		selectedText: {
			fontSize: 16,
			color: "#000",
		},
		stateAndZipInput: {
			fontSize: 16,
			borderWidth: 1,
			padding: 10,
			borderRadius: 5,
			borderColor: "#ccc",
			flex: 1,
			marginLeft: 8,
		},
	});

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
			<View style={styles.container}>
				<TextInput
					style={styles.stateAndZipInput}
					value={zipCode}
					onChangeText={setZipCode}
					inputMode="numeric"
					maxLength={5}
				/>
				<Dropdown
					data={dropDownData}
					value={dropDownValue}
					labelField="label"
					valueField="value"
					onChange={(item) => {
						setDropDownValue(item.value);
					}}
					style={styles.dropDown}
					selectedTextStyle={styles.selectedText}
				/>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={refreshSearch}
				>
					<Text style={globalStyles.buttonText}>Search</Text>
				</TouchableOpacity>
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
