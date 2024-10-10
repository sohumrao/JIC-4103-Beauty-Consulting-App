import { StyleSheet, View, Text } from "react-native";

const ErrorMessage = ({ message }) => {
	if (!message) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffcccb",
		padding: 10,
		borderRadius: 5,
		marginVertical: 10,
	},
	text: {
		color: "#d8000c",
		textAlign: "center",
	},
});

export default ErrorMessage;
