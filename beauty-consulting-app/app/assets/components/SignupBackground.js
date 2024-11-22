import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const SignupBackground = ({ children }) => {
	return (
		<ImageBackground
			source={require("../images/background_2.jpg")}
			style={styles.background}
			blurRadius={10} // Adjust the blur intensity here
		>
			<View style={styles.overlay}>{children}</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: "cover",
	},
	overlay: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
	},
});

export default SignupBackground;
