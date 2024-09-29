import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";
import ErrorMessage from "../../components/ErrorMessage";
import globalStyles from "../../assets/GlobalStyles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation();

	const handleForgotPassword = async () => {
		const req = { email: email };
		try {
			const apiUrl = process.env.EXPO_PUBLIC_API_URL;
			if (!apiUrl) {
				console.error("API URL not defined");
				return;
			}
			const res = await axios.post(
				apiUrl + ":5050/account/emailResetPasswordCode",
				req
			);
			setErrorMessage("");
			navigation.navigate("Reset Password");
		} catch (error) {
			//TODO: standardize how API error format
			if (error.response && error.response.status && error.response.data) {
				setErrorMessage(error.response.data);
			}
			console.error(error);
		}
	};
	return (
		<SignupBackground>
			<View style={globalStyles.box}>
				<Text style={globalStyles.title}>Reset Password</Text>
				<Text style={globalStyles.description}>
					Enter the email associated with your account to reset your password.
				</Text>
				<ErrorMessage message={errorMessage} />
				<TextInput
					style={globalStyles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={handleForgotPassword}
				>
					<Text style={globalStyles.buttonText}>Send Email</Text>
				</TouchableOpacity>
			</View>
		</SignupBackground>
	);
};

export default ForgotPasswordPage;
