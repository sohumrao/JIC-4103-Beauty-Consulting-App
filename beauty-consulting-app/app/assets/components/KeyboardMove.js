import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	StatusBar,
	TouchableWithoutFeedback,
	Keyboard,
	View,
} from "react-native";

const KeyboardMove = ({ children }) => {
	const keyboardVerticalOffset = Platform.select({
		ios: 80,
		android: StatusBar.currentHeight || 80,
	});

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={{ flex: 1 }}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={keyboardVerticalOffset}
				>
					{children}
				</KeyboardAvoidingView>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default KeyboardMove;
