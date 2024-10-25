import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import ContinueButton from "../assets/components/ContinueButton";
import { UserContext } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import handleHTTPError from "../errorHandling";

function ClientDetailsComplete() {
	const navigation = useNavigation();
	const userContext = useContext(UserContext);

	const handleContinue = async () => {
		const req = {
			username: userContext.username,
			name: userContext.name,
			email: userContext.email,
			gender: userContext.gender,
			birthday: userContext.birthday,
			phoneNumber: userContext.phoneNumber,
			hairDetails: userContext.hairDetails,
			allergies: userContext.allergies,
			role: "client",
		};
		console.log(req.body);
		try {
			const apiUrl = process.env.EXPO_PUBLIC_API_URL;
			if (!apiUrl) {
				console.error("API URL not defined");
				return;
			}
			const res = await axios.post(apiUrl + ":5050/client/", req);
			console.log("User created: ", res.data);

			userContext.updateUserContext({
				username: userContext.username,
				role: "client",
			});
			navigation.reset({
				index: 0,
				routes: [{ name: "Main" }],
			});
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<View style={globalStyles.container}>
			<Text style={globalStyles.title}>You're all set!</Text>
			<View style={globalStyles.buttonContainer}>
				<ContinueButton onPress={() => handleContinue()} />
			</View>
		</View>
	);
}

export default ClientDetailsComplete;
