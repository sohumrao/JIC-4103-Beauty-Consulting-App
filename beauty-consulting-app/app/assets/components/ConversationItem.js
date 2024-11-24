import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ConversationItem = ({
	name,
	messagePreview,
	timestamp,
	stylistUsername,
	clientUsername,
}) => {
	const navigation = useNavigation();

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
	};

	const navigateToChat = () => {
		navigation.navigate("Chat", {
			username: name,
			stylistUsername: stylistUsername,
			clientUsername: clientUsername,
		});
	};

	return (
		<TouchableOpacity onPress={navigateToChat} style={styles.container}>
			<View style={styles.messageInfo}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.preview} numberOfLines={1}>
					{messagePreview}
				</Text>
			</View>
			<Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
		</TouchableOpacity>
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
