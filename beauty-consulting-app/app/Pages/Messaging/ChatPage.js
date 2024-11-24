import React, { useContext, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import { UserContext } from "../../contexts/userContext";
import MessageBubble from "../../assets/components/MessageBubble";

function ChatPage({ route }) {
	const { username } = route.params;
	const userContext = useContext(UserContext);
	const [messageHistory, setMessageHistory] = useState();

	console.log(userContext.username);
	console.log(username);
	const fetchConversation = async () => {
		try {
			const response = await api.get("/messages/history", {
				params: {
					clientUsername: userContext.username,
					// stylistUsername: username,
					// we need to grab the account username
					// instead of the name for this
					// not possible with current api call
					stylistUsername: "stylist7",
				},
			});
			setMessageHistory(response.data);
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchConversation();
		}, [])
	);
	const renderMessage = ({ item }) => {
		const isClient = item.sender === userContext.username; // Check if the client sent the message
		return (
			<MessageBubble
				content={item.content}
				timestamp={item.createdAt}
				isClient={isClient}
			/>
		);
	};

	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Chat with {username}</Text>
				<FlatList
					data={messageHistory}
					renderItem={renderMessage}
					keyExtractor={(item) => item._id} // Use unique `_id` from the message
					contentContainerStyle={styles.messagesList}
				/>
			</View>
		</SignupBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	header: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	error: {
		color: "red",
		marginBottom: 10,
		textAlign: "center",
	},
	messagesList: {
		paddingBottom: 20,
	},
});
export default ChatPage;
