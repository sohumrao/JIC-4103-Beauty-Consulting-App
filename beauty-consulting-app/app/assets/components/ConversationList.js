import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import ConversationItem from "./ConversationItem";

const ConversationsList = ({ conversations }) => {
	const renderItem = ({ item }) => {
		return (
			<View style={styles.whiteBox}>
				<ConversationItem
					name={item.name}
					messagePreview={item.messagePreview}
					timestamp={item.timestamp}
					stylistUsername={item.stylistUsername}
					clientUsername={item.clientUsername}
				/>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{conversations && conversations.length > 0 ? (
				<FlatList
					data={conversations}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
				/>
			) : (
				<Text style={styles.noMessagesText}>
					No recent conversations.
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	noMessagesText: {
		marginTop: 20,
		textAlign: "center",
		color: "#666",
		fontSize: 16,
	},
	whiteBox: {
		backgroundColor: "#fff",
		padding: 5,
		marginVertical: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
});

export default ConversationsList;
