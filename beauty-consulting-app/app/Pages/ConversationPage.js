import React from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native";
import { UserContext } from "../contexts/userContext";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import ErrorMessage from "../components/ErrorMessage";
import globalStyles from "../assets/GlobalStyles";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";

const mockConversations = [
	{
		id: "1",
		name: "John Doe",
		lastMessage: "Hey, are we still on for tonight?",
		timestamp: "10:45 AM",
		avatar: "https://via.placeholder.com/50",
	},
	{
		id: "2",
		name: "Jane Smith",
		lastMessage: "Let me know when you're free!",
		timestamp: "Yesterday",
		avatar: "https://via.placeholder.com/50",
	},
	{
		id: "3",
		name: "Bob Johnson",
		lastMessage: "Thanks for the help earlier.",
		timestamp: "Nov 19",
		avatar: "https://via.placeholder.com/50",
	},
];

const ConversationPage = () => {
	const renderConversation = ({ item }) => (
		<TouchableOpacity
			style={styles.conversationContainer}
			onPress={() =>
				navigation.navigate("MessagePage", { userId: item.id })
			}
		>
			<Image source={{ uri: item.avatar }} style={styles.avatar} />
			<View style={styles.textContainer}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.lastMessage} numberOfLines={1}>
					{item.lastMessage}
				</Text>
			</View>
			<Text style={styles.timestamp}>{item.timestamp}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={mockConversations}
				keyExtractor={(item) => item.id}
				renderItem={renderConversation}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	conversationContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	textContainer: {
		flex: 1,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 5,
	},
	lastMessage: {
		fontSize: 14,
		color: "#6e6e6e",
	},
	timestamp: {
		fontSize: 12,
		color: "#a0a0a0",
	},
});

export default ConversationPage;
