import React, { useContext, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "utils/axios";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardMove from "../assets/components/KeyboardMove";
import handleHTTPError from "utils/errorHandling";

const SignInPage = () => {
	const navigation = useNavigation();
	const userContext = useContext(UserContext);

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleSignIn = async () => {
		//NOTE: I think it's ok to not do any frontend validation for sign in
		try {
			const res = await api.post("/account/signIn", formData);
			setError("");
			console.log("Sign in successful: " + res.data);
		} catch (error) {
			handleHTTPError(error, setError);
			return;
		}
		//TODO: refactor signIn to return the userID so this call can be refactored out
		let userProfileDataExists = false;

		try {
			// FIXME: should use data from database
			const clientRes = await api.get(`/client/${formData.username}`);
			userProfileDataExists = true;
			userContext.updateUserContext({
				username: formData.username,
				role: "client",
			});
			userProfileDataExists = true;
			navigation.replace("Main");
			return;
		} catch (error) {
			if (error.status === 409) {
				if (!userProfileDataExists) {
					// FIXME: should use data from database
					const stylistRes = await api.get(
						`/stylist/${formData.username}`
					);
					userContext.updateUserContext({
						username: formData.username,
						role: "stylist",
					});
				}
				userProfileDataExists = true;
				navigation.replace("Main");
				return;
			}

			handleHTTPError(error, setError);
		} finally {
			if (!userProfileDataExists)
				setError(
					"Account with that username and password does not exist."
				);
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
						value={formData.username}
						onChangeText={(text) =>
							setFormData({ ...formData, username: text })
						}
						keyboardType="default"
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={globalStyles.input}
						placeholder="Password"
						value={formData.password}
						onChangeText={(text) =>
							setFormData({ ...formData, password: text })
						}
						secureTextEntry
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<ErrorMessage message={error} />
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
