import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ConversationItem = ({ name, messagePreview, timestamp }) => {
	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	};

	return (
		<View style={styles.container}>
			<View style={styles.messageInfo}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.preview} numberOfLines={1}>
					{messagePreview}
				</Text>
			</View>
			<Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	messageInfo: {
		flex: 1,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 2,
	},
	preview: {
		color: "#555",
		fontSize: 14,
	},
	timestamp: {
		color: "#999",
		fontSize: 12,
		marginLeft: 10,
	},
});

export default ConversationItem;
