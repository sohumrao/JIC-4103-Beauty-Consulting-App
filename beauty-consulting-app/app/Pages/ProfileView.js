import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import globalStyles from "../assets/GlobalStyles";
import axios from "axios";
import ProfileImage from "../assets/components/ProfileImage";

const ProfileView = () => {
	const navigation = useNavigation();
	const userContext = useContext(UserContext);
	const [clientData, setClientData] = useState(null);
	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [allergies, setAllergies] = useState("");
	const [concerns, setConcerns] = useState("");
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		populateClientData(userContext.username);
	}, [userContext.username]);

	const populateClientData = async (username) => {
		try {
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL + ":5050/client/" + username;
			if (!apiURL) {
				console.error("apiURL not defined");
				return;
			}

			const res = await axios.get(apiURL);
			setClientData(res.data);
			setGender(res.data.info.gender);
			setName(res.data.info.name);
			setAllergies(res.data.allergies);
			setConcerns(res.data.additionalConcerns);
		} catch (error) {
			console.error("There was an error retrieving user data: ", error);
		}
	};

	const handleEdit = async () => {
		const updatedName = name !== "" ? name : clientData.info.name;
		const updatedGender = gender !== "" ? gender : clientData.info.gender;
		const updatedAllergies = allergies !== "" ? allergies : clientData.allergies;
		const updatedConcerns = concerns !== "" ? concerns : clientData.additionalConcerns;

		if (isEdit) {
			const req = {
				...clientData,
				info: {
					...clientData.info,
					name: updatedName,
					gender: updatedGender,
				},
				allergies: updatedAllergies,
				additionalConcerns: updatedConcerns,
			};
			try {
				const apiURL =
					process.env.EXPO_PUBLIC_API_URL + ":5050/client/" + userContext.username;
				if (!apiURL) {
					console.error("apiURL not defined");
					return;
				}
				const res = await axios.put(apiURL, req);
				console.log("Update successful: ", res.data);
			} catch (error) {
				console.error("Error with request: ", error);
			}
		}
		setIsEdit(!isEdit);
	};

	const deleteAccount = async () => {
		try {
			const apiURL =
				process.env.EXPO_PUBLIC_API_URL + ":5050/client/" + userContext.username;
			if (!apiURL) {
				console.error("apiURL not defined");
			}
			await axios.delete(apiURL);
			console.log("Account deleted successfully");
			navigation.navigate("Sign In");
		} catch (error) {
			console.error("Error with request: ", error);
			return;
		}
	};

	const styles = StyleSheet.create({
		inputContainer: {
			marginBottom: 10,
		},
	});

	if (!clientData) {
		return (
			<View style={globalStyles.box}>
				<Text style={globalStyles.promptText}>Loading...</Text>
			</View>
		);
	}

	return (
		<SignupBackground>
			<View style={globalStyles.box}>
				<ProfileImage username={userContext.username} />
				<View style={styles.inputContainer}>
					<Text style={globalStyles.inputHeaderText}>Name</Text>
					<TextInput
						style={globalStyles.input}
						placeholder={name}
						placeholderTextColor={"#000"}
						value={name}
						onChangeText={setName}
						editable={isEdit}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={globalStyles.inputHeaderText}>Gender</Text>
					<TextInput
						style={globalStyles.input}
						placeholder={gender}
						placeholderTextColor={"#000"}
						value={gender}
						onChangeText={setGender}
						editable={isEdit}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={globalStyles.inputHeaderText}>Allergies</Text>
					<TextInput
						style={globalStyles.input}
						placeholder={allergies}
						placeholderTextColor={"#000"}
						value={allergies}
						onChangeText={setAllergies}
						editable={isEdit}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={globalStyles.inputHeaderText}>Concerns</Text>
					<TextInput
						style={globalStyles.input}
						placeholder={concerns}
						placeholderTextColor={"#000"}
						value={concerns}
						onChangeText={setConcerns}
						editable={isEdit}
					/>
				</View>

				<TouchableOpacity
					style={[globalStyles.button, { marginBottom: 15 }]}
					onPress={handleEdit}
				>
					<Text style={globalStyles.buttonText}>
						{isEdit ? "Update" : "Edit"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={globalStyles.button}
					onPress={deleteAccount}
				>
					<Text style={globalStyles.buttonText}>Delete Account</Text>
				</TouchableOpacity>
			</View>
		</SignupBackground>
	);
};

export default ProfileView;
