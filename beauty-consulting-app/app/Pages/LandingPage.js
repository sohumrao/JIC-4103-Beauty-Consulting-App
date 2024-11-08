import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

import ContinueButton from "../assets/components/ContinueButton";
import LandingPageImg from "../assets/images/LandingPageImg.png";
import SignupBackground from "../assets/components/SignupBackground";

function LandingPage() {
	const navigation = useNavigation();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			justifyContent: "space-around",
		},
		imageContainer: {
			alignItems: "center",
			justifyContent: "center",
			marginTop: 50,
			marginBottom: -50,
		},
		circleImage: {
			width: 350,
			height: 350,
			borderRadius: 175,
			borderWidth: 3,
			borderColor: "black",
			overflow: "hidden",
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			textAlign: "center",
			marginTop: -48,
			color: "#fff",
		},
		buttonContainer: {
			width: "100%",
			paddingHorizontal: 20,
			paddingVertical: 40,
		},
	});

	return (
		<SignupBackground>
			<View style={styles.imageContainer}>
				<Image source={LandingPageImg} style={styles.circleImage} />
			</View>
			<View>
				<View style={styles.buttonContainer}>
					<ContinueButton
						title="Sign up as a Client"
						onPress={() =>
							navigation.navigate("Client Details Stack", {
								screen: "ClientDetails",
							})
						}
					/>
				</View>
				<View style={styles.buttonContainer}>
					<ContinueButton
						title="Sign up as a Stylist"
						onPress={() =>
							navigation.navigate("Stylist Details Stack", {
								screen: "StylistDetails",
							})
						}
					/>
				</View>
			</View>
		</SignupBackground>
	);
}

export default LandingPage;
