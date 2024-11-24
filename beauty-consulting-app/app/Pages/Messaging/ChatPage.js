import React, { useContext, useState, useEffect, useRef } from "react";
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
	var ws = useRef(null);
	const [isConnected, setIsConnected] = useState(false);

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

	useFocusEffect(
		React.useCallback(() => {
			//This is a bit of a hack to get the URL from
			//EXPO_PUBLIC_API_URL
			//Need to revisit
			const apiUrl = process.env.EXPO_PUBLIC_API_URL;
			const websocketUrl = apiUrl.replace(/^http:\/\//, "");
			console.log(websocketUrl);
			ws.current = new WebSocket(`ws://${websocketUrl}`);

			ws.current.onopen = () => {
				setIsConnected(true);
			};
			ws.current.onclose = () => {
				setIsConnected(false);
			};
			return () => {
				if (ws.current) {
					ws.current.close();
					console.log("WebSocket connection closed on page exit");
				}
			};
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
