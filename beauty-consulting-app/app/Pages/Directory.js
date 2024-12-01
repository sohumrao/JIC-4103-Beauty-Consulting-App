import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import globalStyles from "../assets/GlobalStyles";
import StylistListing from "../components/StylistListing";
import api from "utils/axios";
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import { getCityFromZIP } from "utils/geocoding";
import ErrorMessage from "../components/ErrorMessage";
import AppointmentModal from "../assets/components/appointmentModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import SignupBackground from "../assets/components/SignupBackground";

const Directory = () => {
	var userContext = useContext(UserContext);
	const [city, setCity] = useState("Atlanta"); // TODO: change default value once clients input address
	const [prevReq, setPrevReq] = useState(null);
	const [stylistData, setStylistData] = useState(null);
	const [zipCode, setZipCode] = useState("30332");
	const [messageError, setMessageError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [currentStylist, setCurrentStylist] = useState(null);
	const [stylistsBooked, setStylistsBooked] = useState([]);

	useEffect(() => {
		retrieveStylistData(city);
	}, [userContext.username, city]);

	const onRefresh = React.useCallback(() => {
		setIsLoading(true);
		refreshSearch().then(() => setIsLoading(false));
	});

	const retrieveStylistData = async (queryCity) => {
		try {
			setCity(queryCity);
			const req = {
				username: userContext.username,
				distance: dropDownValue,
				city: queryCity,
			};
			setPrevReq(req);
			// prevent repeated requests with same information
			// save API calls
			// we still make one call to check city with each request but thats fine
			if (
				prevReq &&
				req.distance == prevReq.distance &&
				req.city == prevReq.city
			) {
				return;
			}
			setIsLoading(true);
			const res = await api.post(
				`/client/matchStylists/${userContext.username}`,
				req
			);
			setIsLoading(false);
			setMessageError("");
			setStylistData(res.data);
		} catch (error) {
			handleHTTPError(error);
			setIsLoading(false);
			setStylistData(null);
		}
	};

	const refreshSearch = async () => {
		if (zipCode.length < 5) {
			setMessageError("Input a full ZIP code.");
			return;
		}
		try {
			const locationResponse = await getCityFromZIP(zipCode);
			setMessageError("");
			retrieveStylistData(locationResponse.city);
		} catch (error) {
			setMessageError("Error Retrieving Results");
			handleHTTPError(error);
		}
	};

	/*
	 * function passed to each stylist listing block
	 * done in this file so we don't have to pass state around
	 */
	const handleBookPress = (stylistUsername) => {
		setCurrentStylist(stylistUsername);
		setModalVisible(true);
	};

	const createAppointment = async (date, time) => {
		try {
			if (!date || !time) {
				console.error("AHHHHHH"); // TODO: handle better
				return;
			}
			const req = {
				clientUsername: userContext.username,
				stylistUsername: currentStylist,
				appointmentDate: date + "T" + time,
				duration: 60,
				notes: "",
			};
			const res = await api.get(
				`/appointment/checkBooking?stylistUsername=${req.stylistUsername}&dateTime=${req.appointmentDate}`
			);
			if (!res.data.available) {
				// TODO: handle error better
				console.error("APPOINTMENT NOT AVAILABLE AT TIME ");
				return;
			}
			console.log(req);
			await api.post("/appointment/create", req);
			setModalVisible(false);
			setStylistsBooked([...stylistsBooked, currentStylist]);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const dropDownData = [
		{ label: "10 miles", value: 10 },
		{ label: "20 miles", value: 20 },
		{ label: "50 miles", value: 50 },
	];

	const [dropDownValue, setDropDownValue] = useState(dropDownData[0].value);

	const renderHeaderWithInputs = () => (
		<View>
			{/* Styled Header */}
			<View style={styles.headerBar}>
				{/* Profile Photo */}
				{userContext.userProfile?.profilePhoto ? (
					<Image
						source={{ uri: userContext.userProfile.profilePhoto }}
						style={styles.profilePhoto}
					/>
				) : (
					<View style={styles.placeholderPhoto}>
						<Ionicons name="person" size={24} color="#fff" />
					</View>
				)}
				<Text style={styles.headerTitle}>Stylists for You</Text>
				{/* Placeholder to balance the layout */}
				<View style={styles.headerRightPlaceholder} />
			</View>
			{/* Inputs */}
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
			</View>
			<ErrorMessage message={messageError} />
		</View>
	);

	if (isLoading) {
		return (
			<View style={globalStyles.container}>
				{renderHeaderWithInputs()}
				<View style={globalStyles.centeringContainer}>
					<Text style={globalStyles.promptText}>
						Finding Stylists
					</Text>
					<ActivityIndicator size="large" animating={isLoading} />
				</View>
			</View>
		);
	}
	return (
		<View style={globalStyles.container}>
			{renderHeaderWithInputs()}
			{stylistData ? (
				<View style={globalStyles.container}>
					<ScrollView
						style={globalStyles.directoryContainer}
						contentContainerStyle={{ flexGrow: 1 }}
					>
						<RefreshControl
							refreshing={isLoading}
							onRefresh={onRefresh}
							colors={["#000"]}
							tintColor="#000"
						/>
						{stylistData.map((stylist) => (
							<View key={stylist.username}>
								<StylistListing
									profilePicture={stylist.profilePicture}
									stylistName={stylist.name}
									businessName={stylist.businessName}
									businessAddress={stylist.businessAddress}
									username={stylist.username}
									booked={stylistsBooked}
									handleBookingPress={() => {
										handleBookPress(stylist.username);
									}}
								/>
							</View>
						))}
					</ScrollView>
					{modalVisible ? (
						<AppointmentModal
							visible={modalVisible}
							onClose={hideModal}
							onCreateAppointment={createAppointment}
							stylistUsername={currentStylist}
						/>
					) : null}
				</View>
			) : (
				<ScrollView>
					<RefreshControl
						refreshing={isLoading}
						onRefresh={onRefresh}
						colors={["#000"]}
						tintColor="#000"
					/>
					<ErrorMessage
						message={
							"Could not find stylist in " +
							city +
							". \n Try a different search."
						}
					/>
				</ScrollView>
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
	headerBar: {
		height: 60,
		width: 350,
		backgroundColor: "#fa4e41",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		marginBottom: 10,
		marginTop: 60,
		alignSelf: "center",
	},
	profilePhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
	},
	placeholderPhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#555",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRightPlaceholder: {
		width: 40,
	},
});

export default Directory;
