import React, { useContext, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardMove from "../assets/components/KeyboardMove";
import handleHTTPError from "../errorHandling";

const SignInPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation();

	const userContext = useContext(UserContext);

	const handleSignIn = async () => {
		const req = {
			username: username,
			password: password,
		};

		const apiUrl = process.env.EXPO_PUBLIC_API_URL;
		if (!apiUrl) {
			console.error("API URL not defined");
			return;
		}

		try {
			const res = await axios.post(apiUrl + ":5050/account/signIn", req);
			setErrorMessage("");
			console.log("Sign in successful: " + res.data);
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
			return;
		}

		let userProfileDataExists = false;

		try {
			const clientRes = await axios.get(
				apiUrl + ":5050/client/" + username
			);
			userProfileDataExists = true;
			userContext.updateUserContext({
				username: username,
				role: "client",
			});
			navigation.replace("Main");
			return;
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}

		if (!userProfileDataExists) {
			try {
				const stylistRes = await axios.get(
					apiUrl + ":5050/stylist/" + username
				);
				userProfileDataExists = true;
				userContext.updateUserContext({
					username: username,
					role: "stylist",
				});

				navigation.replace("Main");
				return;
			} catch (error) {
				handleHTTPError(error, setErrorMessage);
				return;
			}
		}
		if (!userProfileDataExists) {
			console.log("no navigation");
			navigation.replace("LandingPage");
		}
	};

	return (
		<KeyboardMove>
			<SignupBackground>
				<View style={globalStyles.box}>
					<Text style={globalStyles.title}>Sign In</Text>
					<TextInput
						style={globalStyles.input}
						placeholder="Username"
						value={username}
						onChangeText={setUsername}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={globalStyles.input}
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<ErrorMessage message={errorMessage} />
					<TouchableOpacity
						style={globalStyles.button}
						onPress={handleSignIn}
					>
						<Text style={globalStyles.buttonText}>Sign In</Text>
					</TouchableOpacity>
					<Text style={globalStyles.promptText}>
						Don't have an account?
					</Text>
					<Text
						style={globalStyles.linkText}
						onPress={() => {
							navigation.navigate("Create Account");
						}}
					>
						Create one.
					</Text>
					<Text
						style={globalStyles.linkText}
						onPress={() => {
							navigation.navigate("Forgot Password");
						}}
					>
						Forgot Password?
					</Text>
				</View>
			</SignupBackground>
		</KeyboardMove>
	);
};

export default SignInPage;
