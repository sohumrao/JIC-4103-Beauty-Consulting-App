import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import ConversationItem from "./ConversationItem";

const ConversationsList = ({ conversations }) => {
	const renderItem = ({ item }) => {
		return (
			<ConversationItem
				name={item.name}
				messagePreview={item.messagePreview}
				timestamp={item.timestamp}
			/>
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
		backgroundColor: "#f9f9f9",
	},
	noMessagesText: {
		marginTop: 20,
		textAlign: "center",
		color: "#666",
		fontSize: 16,
	},
});

export default ConversationsList;
