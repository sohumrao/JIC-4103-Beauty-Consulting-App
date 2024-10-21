import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";

import OptionsButton from "../assets/components/OptionsButton";
import ContinueButton from "../assets/components/ContinueButton";

function ClientDetails2() {
	const navigation = useNavigation();

	const userContext = useContext(UserContext);

	const [formData, setFormData] = useState({
		Natural: false,
		Relaxed: false,
		Straight: false,
		Wavy: false,
		Curly: false,
		DeepWave: false,
		LooseCurl: false,
		TightlyCoiled: false,
		Fine: false,
		Medium: false,
		Thick: false,
	});

	const handleSelectionChange = (option) => {
		setFormData((prev) => ({ ...prev, [option]: !prev[option] }));
	};

	const handleContinue = () => {
		userContext.updateUserContext({
			username: userContext.username,
			name: userContext.name,
			age: userContext.age,
			gender: userContext.gender,
			phoneNumber: userContext.phoneNumber,
			email: userContext.email,
			hairDetails: formData,
			allergies: userContext.allergies,
			concerns: userContext.concerns,
		});
		navigation.navigate("ClientDetails3");
	};

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 20,
			backgroundColor: "#fff",
		},
		header: {
			fontSize: 22,
			fontWeight: "bold",
			marginBottom: 20,
			textAlign: "center",
		},
		stepIndicator: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 20,
		},
		step: {
			flex: 1,
			height: 5,
			backgroundColor: "#eee",
			borderRadius: 2.5,
			marginHorizontal: 2,
		},
		stepCompleted: {
			backgroundColor: "red",
		},
		form: {
			marginBottom: 20,
		},
		label: {
			fontSize: 16,
			marginBottom: 10,
		},
		bubbleContainer: {
			flexDirection: "row",
			padding: 20,
			backgroundColor: "#fff",
		},
		optionsContainer: {
			flexDirection: "column",
			flex: 1,
			justifyContent: "space-between",
			marginBottom: 20,
		},
		allOptionsContainer: {
			flexDirection: "row",
			flex: 1,
			justifyContent: "space-between",
			marginBottom: 20,
		},
	});

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Client Details</Text>
			<View style={styles.stepIndicator}>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={[styles.step, styles.stepCompleted]}></View>
				<View style={styles.step}></View>
				<View style={styles.step}></View>
			</View>
			<View style={styles.container}>
				<Text style={styles.header}>Hair Type</Text>
				<View style={styles.allOptionsContainer}>
					<View style={styles.optionsContainer}>
						<OptionsButton
							title="Natural"
							onPress={() => handleSelectionChange("Natural")}
							selected={formData.Natural}
						/>
						<OptionsButton
							title="Relaxed"
							onPress={() => handleSelectionChange("Relaxed")}
							selected={formData.Relaxed}
						/>
						<OptionsButton
							title="Straight"
							onPress={() => handleSelectionChange("Straight")}
							selected={formData.Straight}
						/>
						<OptionsButton
							title="Wavy"
							onPress={() => handleSelectionChange("Wavy")}
							selected={formData.Wavy}
						/>
					</View>
					<View style={styles.optionsContainer}>
						<OptionsButton
							title="Curly"
							onPress={() => handleSelectionChange("Curly")}
							selected={formData.Curly}
						/>
						<OptionsButton
							title="Deep Wave"
							onPress={() => handleSelectionChange("DeepWave")}
							selected={formData.DeepWave}
						/>
						<OptionsButton
							title="Loose Curl"
							onPress={() => handleSelectionChange("LooseCurl")}
							selected={formData.LooseCurl}
						/>
						<OptionsButton
							title="Tightly Coiled"
							onPress={() =>
								handleSelectionChange("TightlyCoiled")
							}
							selected={formData.TightlyCoiled}
						/>
					</View>
				</View>
				<Text style={styles.header}>Hair Density</Text>
				<View
					style={[
						styles.optionsContainer,
						{
							justifyContent: "space-between",
							flexDirection: "row",
						},
					]}
				>
					<View style={[styles.optionsContainer]}>
						<OptionsButton
							title="Fine"
							onPress={() => handleSelectionChange("Fine")}
							selected={formData.Fine}
						/>
					</View>
					<View style={[styles.optionsContainer]}>
						<OptionsButton
							title="Medium"
							onPress={() => handleSelectionChange("Medium")}
							selected={formData.Medium}
						/>
					</View>
					<View style={[styles.optionsContainer]}>
						<OptionsButton
							title="Thick"
							onPress={() => handleSelectionChange("Thick")}
							selected={formData.Thick}
						/>
					</View>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<ContinueButton onPress={() => handleContinue()} />
			</View>
		</ScrollView>
	);
}

export default ClientDetails2;
