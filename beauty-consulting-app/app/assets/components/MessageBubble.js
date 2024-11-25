import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageBubble = ({ content, timestamp, isClient }) => {
	return (
		<View
			style={[
				styles.messageContainer,
				isClient ? styles.clientMessage : styles.stylistMessage,
			]}
		>
			<Text style={styles.messageContent}>{content}</Text>
			<Text style={styles.messageTimestamp}>
				{new Date(timestamp).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	messageContainer: {
		maxWidth: "80%",
		marginVertical: 5,
		padding: 10,
		borderRadius: 10,
	},
	clientMessage: {
		alignSelf: "flex-end",
		backgroundColor: "#c5e0fc",
	},
	stylistMessage: {
		alignSelf: "flex-start",
		backgroundColor: "#F1F0F0",
	},
	messageContent: {
		fontSize: 16,
	},
	messageTimestamp: {
		fontSize: 12,
		color: "#999",
		marginTop: 5,
		textAlign: "right",
	},
});

export default MessageBubble;
