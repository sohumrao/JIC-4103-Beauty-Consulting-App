import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SignupBackground from "../../assets/components/SignupBackground";
import globalStyles from "../../assets/GlobalStyles";
import ErrorMessage from "../../components/ErrorMessage";
import handleHTTPError from "utils/errorHandling";
import api from "utils/axios";
import KeyboardMove from "../../assets/components/KeyboardMove";
//TODO:
// clean up error display
// allow resending resetCode
const ResetPasswordPage = () => {
	const [formData, setFormData] = useState({
		resetCode: "",
		password: "",
		passwordConfirm: "",
	});
	const [validresetCode, setValidresetCode] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation();

	const handleInputChange = (name, value) => {
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleVerifyresetCode = async () => {
		try {
			await api.post("/account/verifyResetPasswordCode", {
				resetCode: formData.resetCode,
			});
			setValidresetCode(true);
			setErrorMessage(""); // Clear error on success
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	const handleResetPassword = async () => {
		if (formData.password !== formData.passwordConfirm) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			await api.post("/account/resetPassword", {
				resetCode: formData.resetCode,
				password: formData.password,
			});
			setSuccess(true);
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	return (
		<KeyboardMove>
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
								Enter the reset code sent to your email
							</Text>
							<TextInput
								style={globalStyles.input}
								placeholder="Reset Code"
								value={formData.resetCode}
								onChangeText={(value) =>
									handleInputChange("resetCode", value)
								}
								autoCapitalize="none"
							/>
							<TouchableOpacity
								style={globalStyles.button}
								onPress={handleVerifyresetCode}
							>
								<Text style={globalStyles.buttonText}>
									Verify Reset Code
								</Text>
							</TouchableOpacity>
							<ErrorMessage message={errorMessage} />
							{validresetCode && (
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
		</KeyboardMove>
	);
};

export default ResetPasswordPage;
