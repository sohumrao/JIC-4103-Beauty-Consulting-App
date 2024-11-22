import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import KeyboardMove from "../../assets/components/KeyboardMove";
import SignupBackground from "../../assets/components/SignupBackground";
import ErrorMessage from "../../components/ErrorMessage";
import globalStyles from "../../assets/GlobalStyles";
import api from "utils/axios";
import { useNavigation } from "@react-navigation/native";
import handleHTTPError from "utils/errorHandling";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation();

	const handleForgotPassword = async () => {
		const req = { email: email };
		try {
			await api.post("/account/emailResetPasswordCode", req);
			setErrorMessage("");
			navigation.navigate("Reset Password");
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};
	return (
		<KeyboardMove>
			<SignupBackground>
				<View style={globalStyles.box}>
					<Text style={globalStyles.title}>Reset Password</Text>
					<Text style={globalStyles.description}>
						Enter the email associated with your account to reset
						your password.
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
		</KeyboardMove>
	);
};

export default ForgotPasswordPage;
