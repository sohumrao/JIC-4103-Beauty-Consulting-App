import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Modal,
	Touchable,
} from "react-native";
import { Link, useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import ErrorMessage from "../components/ErrorMessage";
import globalStyles from "../assets/GlobalStyles";
import axios from "axios";

const ProfileView = () => {
	const navigation = useNavigation();

	var userContext = useContext(UserContext);
	var [clientData, setClientData] = useState(null);
	var [name, setName] = useState("");
	var [gender, setGender] = useState("");
	var [allergies, setAllergies] = useState("");
	var [concerns, setConcerns] = useState("");
	var [isEdit, setIsEdit] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	var [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

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
		name = name != "" ? name : clientData.info.name;
		gender = gender != "" ? gender : clientData.info.gender;
		allergies = allergies != "" ? allergies : clientData.allergies;
		concerns = concerns != "" ? concerns : clientData.additionalConcerns;

		if (isEdit) {
			req = {
				...clientData,
				info: {
					...clientData.info,
					name: name,
					gender: gender,
				},
				allergies: allergies,
				additionalConcerns: concerns,
			};
			try {
				const apiURL =
					process.env.EXPO_PUBLIC_API_URL +
					":5050/client/" +
					userContext.username;
				if (!apiURL) {
					console.error("apiURL not defined");
					return;
				}
				const res = await axios.put(apiURL, req);
				console.log("update successful: ", res.data);
			} catch (error) {
				console.error("Error with request: ", error);
			}
		}
		setIsEdit(!isEdit);
	};

	const deleteAccount = async () => {
		// confirm password
		try {
			console.log(userContext);
			const apiURLConfirmPassword =
				process.env.EXPO_PUBLIC_API_URL + ":5050/account/signIn";
			const req = {
				username: userContext.username,
				password: password,
			};
			if (!apiURLConfirmPassword) {
				console.error("apiURL not defined");
			}
			const res = await axios.post(apiURLConfirmPassword, req);
		} catch (error) {
			if (error.response.status == 401) {
				setErrorMessage("Incorrect Password");
			} else {
				setErrorMessage(error.response.data);
			}
			return;
		}
		// delete if no problems
		try {
			const apiURLDelete =
				process.env.EXPO_PUBLIC_API_URL +
				":5050/client/" +
				userContext.username;
			if (!apiURLDelete) {
				console.error("apiURL not defined");
			}
			const res = axios.delete(apiURLDelete);
			console.log(res.message);
		} catch (error) {
			console.error("Error with request: ", error);
			return;
		}
		setModalVisible(false);
		navigation.navigate("Sign In");
	};

	const styles = StyleSheet.create({
		inputContainer: {
			marginBottom: 10,
		},
		modalCentering: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
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

				<Modal
					animationType="slide"
					visible={modalVisible}
					transparent={true}
				>
					<SignupBackground>
						<View style={globalStyles.box}>
							<Text style={globalStyles.title}>
								{" "}
								Enter your Password to Confirm{" "}
							</Text>
							<TextInput
								style={globalStyles.input}
								value={password}
								onChangeText={setPassword}
							/>
							<ErrorMessage message={errorMessage} />
							<TouchableOpacity
								style={[
									globalStyles.button,
									{ marginBottom: 10 },
								]}
								onPress={deleteAccount}
							>
								<Text style={globalStyles.buttonText}>
									Delete
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={globalStyles.button}
								onPress={() => {
									setModalVisible(!modalVisible);
									setPassword("");
									setErrorMessage("");
								}}
							>
								<Text style={globalStyles.buttonText}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</SignupBackground>
				</Modal>

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
					onPress={() => {
						setModalVisible(!modalVisible);
					}}
				>
					<Text style={globalStyles.buttonText}>Delete Account</Text>
				</TouchableOpacity>
			</View>
		</SignupBackground>
	);
};

export default ProfileView;
