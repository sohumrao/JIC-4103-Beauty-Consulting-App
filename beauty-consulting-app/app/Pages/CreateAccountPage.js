import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "utils/axios";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import ErrorMessage from "../components/ErrorMessage";
import handleHTTPError from "utils/errorHandling";
import { createAccountSchema } from "../../../shared/schemas";

const CreateAccountPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigation = useNavigation();

	const userContext = useContext(UserContext);
	const handleCreateAccount = async () => {
		try {
			await createAccountSchema.validateAsync(formData);
			const res = await api.post("/account/createAccount", formData);
			console.log("Account created: ", res.data);
		} catch (error) {
			handleHTTPError(error, setError);
			return;
		}
		userContext.updateUserContext({
			...userContext,
			username: formData.username,
		});
		navigation.navigate("LandingPage");
	};

	return (
		<SignupBackground>
			<View style={globalStyles.box}>
				<Text style={globalStyles.title}>Create Your Account</Text>
				<Text style={globalStyles.linkText}>Username</Text>
				<TextInput
					style={globalStyles.input}
					placeholder="Username"
					value={formData.username}
					onChangeText={(text) =>
						setFormData({ ...formData, username: text })
					}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<Text style={globalStyles.linkText}>Password</Text>
				<TextInput
					style={globalStyles.input}
					placeholder="Password"
					value={formData.password}
					onChangeText={(text) =>
						setFormData({ ...formData, password: text })
					}
					secureTextEntry
					autoCapitalize="none"
				/>
				<ErrorMessage message={error} />
				<TouchableOpacity
					style={globalStyles.button}
					onPress={handleCreateAccount}
				>
					<Text style={globalStyles.buttonText}>Create Account</Text>
				</TouchableOpacity>
				<Text style={globalStyles.promptText}>
					Already have an account?
				</Text>
				<Text
					style={globalStyles.linkText}
					onPress={() => navigation.navigate("Sign In")}
				>
					Sign in.
				</Text>
			</View>
		</SignupBackground>
	);
};

export default CreateAccountPage;
