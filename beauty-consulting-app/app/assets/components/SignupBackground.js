import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";

const SignupBackground = ({ children }) => {
	return (
		<ImageBackground
			source={require("../images/background.png")}
			style={styles.background}
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
