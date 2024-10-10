import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SignupBackground from "../../assets/components/SignupBackground";
import globalStyles from "../../assets/GlobalStyles";
import ErrorMessage from "../../components/ErrorMessage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

//TODO:
// clean up error display
// allow resending code
const ResetPasswordPage = () => {
	const [formData, setFormData] = useState({
		code: "",
		password: "",
		passwordConfirm: "",
	});
	const [validCode, setValidCode] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation();

	const handleInputChange = (name, value) => {
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleVerifyCode = async () => {
		if (!API_URL) {
			setErrorMessage("API URL not defined");
			return;
		}

		try {
			await axios.post(
				`${API_URL}:5050/account/verifyResetPasswordCode`,
				{
					code: formData.code,
				}
			);
			setValidCode(true);
			setErrorMessage(""); // Clear error on success
		} catch (error) {
			if (error.response?.status === 400) {
				setErrorMessage("Invalid code. Please try again.");
			} else {
				console.error("Error with Verify Code:", error);
				setErrorMessage(
					"An unexpected error occurred. Please try again later."
				);
			}
		}
	};

	const handleResetPassword = async () => {
		if (formData.password !== formData.passwordConfirm) {
			setErrorMessage("Passwords do not match");
			return;
		}

		if (!API_URL) {
			setErrorMessage("API URL not defined");
			return;
		}

		try {
			await axios.post(`${API_URL}:5050/account/resetPassword`, {
				code: formData.code,
				password: formData.password,
			});
			setSuccess(true);
		} catch (error) {
			if (error.response?.status === 400) {
				setErrorMessage("Invalid code. Please try again.");
			} else {
				console.error("Error with Reset Password:", error);
				setErrorMessage(
					"An unexpected error occurred. Please try again later."
				);
			}
		}
	};

	return (
		<SignupBackground>
			<View style={globalStyles.box}>
				{success ? (
					<>
						<Text style={globalStyles.title}>
							Password Reset Successful.
						</Text>
						<TouchableOpacity
							style={globalStyles.button}
							onPress={() => navigation.navigate("Sign In")}
						>
							<Text style={globalStyles.buttonText}>
								Return to Sign In
							</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<Text style={globalStyles.title}>
							Enter the code sent to your email
						</Text>
						<TextInput
							style={globalStyles.input}
							placeholder="Code"
							value={formData.code}
							onChangeText={(value) =>
								handleInputChange("code", value)
							}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={globalStyles.button}
							onPress={handleVerifyCode}
						>
							<Text style={globalStyles.buttonText}>
								Verify Code
							</Text>
						</TouchableOpacity>
						<ErrorMessage message={errorMessage} />
						{validCode && (
							<>
								<TextInput
									style={globalStyles.input}
									placeholder="New Password"
									value={formData.password}
									onChangeText={(value) =>
										handleInputChange("password", value)
									}
									secureTextEntry
									autoCapitalize="none"
									autoCorrect={false}
								/>
								<TextInput
									style={globalStyles.input}
									placeholder="Confirm New Password"
									value={formData.passwordConfirm}
									onChangeText={(value) =>
										handleInputChange(
											"passwordConfirm",
											value
										)
									}
									secureTextEntry
									autoCapitalize="none"
									autoCorrect={false}
								/>
								<TouchableOpacity
									style={globalStyles.button}
									onPress={handleResetPassword}
								>
									<Text style={globalStyles.buttonText}>
										Reset Password
									</Text>
								</TouchableOpacity>
							</>
						)}
					</>
				)}
			</View>
		</SignupBackground>
	);
};

export default ResetPasswordPage;
