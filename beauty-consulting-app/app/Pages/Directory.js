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
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "../errorHandling.js";
import { getCityFromZIP } from "../geocoding.js";
import ErrorMessage from "../components/ErrorMessage";
import { renderAppointmentModal } from "../assets/components/appointmentModal.js";
import moment from "moment";

const Directory = () => {
	var userContext = useContext(UserContext);
	const [city, setCity] = useState("Atlanta"); // TODO: change default value once clients input address
	const [stylistData, setStylistData] = useState(null);
	const [zipCode, setZipCode] = useState("30332");
	const [messageError, setMessageError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		retrieveStylistData(city);
	}, [userContext.username, city]);

	const retrieveStylistData = async (city) => {
		try {
			const req = {
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
			setIsLoading(true);
			const res = await axios.post(apiURL, req);
			setIsLoading(false);
			setStylistData(res.data);
		} catch (error) {
			setIsLoading(false);
			setStylistData(null);
		}
	};

	const [currentStylist, setCurrentStylist] = useState(null);
	/*
	 * function passed to each stylist listing block
	 * done in this file so we don't have to pass state around
	 */
	const handleBookPress = (stylistUsername) => {
		setModalVisible(true);
		setCurrentStylist(stylistUsername);
	};

	const [dateSelected, setDateSelected] = useState(
		moment().format("YYYY-MM-DD")
	);
	var [timeSelected, setTimeSelected] = useState("12:00:00");
	// TODO: prevent multiple appointments being created
	// maybe blur button / make it non interactable for that session?
	const createAppointment = async () => {
		try {
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL + ":5050/appointment/create";
			const req = {
				clientUsername: userContext.username,
				stylistUsername: currentStylist,
				appointmentDate: dateSelected + "T" + timeSelected,
				duration: 60,
				notes: "",
			};
			console.log(req);
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}
			const res = await axios.post(apiURL, req);
			console.log("Appointment Created!");
		} catch (error) {
			handleHTTPError(error);
		}
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const refreshSearch = async () => {
		if (zipCode.length < 5) {
			setMessageError("Input a full ZIP code.");
			return;
		}
		try {
			const locationResponse = await getCityFromZIP(zipCode);
			setMessageError("");
			setCity(locationResponse.city);
			retrieveStylistData(city);
		} catch (error) {
			setMessageError("Error Retrieving Results");
			handleHTTPError(error);
		}
	};

	const dropDownData = [
		{ label: "10 miles", value: 10 },
		{ label: "20 miles", value: 20 },
		{ label: "50 miles", value: 50 },
	];

	const [dropDownValue, setDropDownValue] = useState(dropDownData[0].value);

	const renderHeaderWithInputs = () => (
		<View>
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
					returnKeyType="done"
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
				<TouchableOpacity style={styles.button} onPress={refreshSearch}>
					<Text style={globalStyles.buttonText}>Refresh</Text>
				</TouchableOpacity>
			</View>
			<ErrorMessage message={messageError} />
		</View>
	);

	if (isLoading) {
		return (
			<View style={globalStyles.container}>
				{renderHeaderWithInputs()}
				<View style={globalStyles.centeringContainer}>
					<View style={globalStyles.box}>
						<Text style={globalStyles.promptText}>Loading...</Text>
					</View>
				</View>
			</View>
		);
	}
	return (
		<View style={globalStyles.container}>
			{renderHeaderWithInputs()}
			{stylistData ? (
				<View>
					<ScrollView style={globalStyles.directoryContainer}>
						{stylistData.map((stylist) => (
							<View key={stylist.username}>
								<StylistListing
									profilePicture={stylist.profilePicture}
									stylistName={stylist.name}
									businessName={stylist.businessName}
									businessAddress={stylist.businessAddress}
									mostSimilarHairDetails={
										stylist.mostSimilarHairDetails
									}
									username={stylist.username}
									handleBookingPress={() => {
										handleBookPress(stylist.username);
									}}
								/>
							</View>
						))}
					</ScrollView>
					{modalVisible &&
						renderAppointmentModal(
							modalVisible,
							createAppointment,
							hideModal
						)}
				</View>
			) : (
				<ErrorMessage
					message={
						"Could not find stylist in " +
						city +
						". \n Try a different search."
					}
				/>
			)}
		</View>
	);
};

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
	button: {
		backgroundColor: "#FF5252",
		paddingVertical: 10,
		borderRadius: 5,
		justifyContent: "center",
		marginRight: 8,
		padding: 10,
		alignItems: "center",
	},
});

export default Directory;
