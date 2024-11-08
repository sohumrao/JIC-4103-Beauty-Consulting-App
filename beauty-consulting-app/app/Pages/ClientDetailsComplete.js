import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "utils/axios";
import ContinueButton from "../assets/components/ContinueButton";
import { UserContext } from "../contexts/userContext";
// import globalStyles from "../assets/GlobalStyles";
import handleHTTPError from "utils/errorHandling";

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
			const res = await api.post("/client", req);
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
		<View style={styles.container}>
			<Text style={styles.title}>You're all set!</Text>
			<View style={styles.buttonContainer}>
				<ContinueButton onPress={() => handleContinue()} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	buttonContainer: {
		marginTop: 20,
		width: "100%",
		alignItems: "center",
	},
});

export default ClientDetailsComplete;
