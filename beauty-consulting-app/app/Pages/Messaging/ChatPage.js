import React, { useContext, useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TextInput,
	Button,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import { UserContext } from "../../contexts/userContext";
import MessageBubble from "../../assets/components/MessageBubble";

function ChatPage({ route }) {
	const { username, stylistUsername, clientUsername } = route.params;
	const userContext = useContext(UserContext);
	const [messageHistory, setMessageHistory] = useState();
	const [newMessage, setNewMessage] = useState("");
	var ws = useRef(null);
	const [isConnected, setIsConnected] = useState(false);

	//username is the name of whomever is being chatted with
	//stylistUsername and clientUsername are the literal
	//usernames
	//e.g. username = Stylist 7
	//     clientUsername = stylist7
	const fetchConversation = async () => {
		try {
			const response = await api.get("/messages/history", {
				params: {
					clientUsername: clientUsername,
					stylistUsername: stylistUsername,
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
			ws.current = new WebSocket(`ws://${websocketUrl}`);

			ws.current.onopen = () => {
				setIsConnected(true);
				ws.current.send(
					JSON.stringify({
						event: "joinRoom",
						username: clientUsername,
					})
				);
				ws.current.send(
					JSON.stringify({
						event: "joinRoom",
						username: stylistUsername,
					})
				);
			};
			ws.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.event === "messageReceived") {
					setMessageHistory((prevMessages) => [
						...prevMessages,
						data.message,
					]);
				}
			};
			ws.current.onclose = () => {
				setIsConnected(false);
			};
			return () => {
				if (ws.current) {
					ws.current.close();
				}
			};
		}, [])
	);

	const sendMessage = () => {
		if (
			newMessage.trim() === "" ||
			!ws.current ||
			ws.current.readyState !== WebSocket.OPEN
		) {
			return;
		}

		const message = {
			event: "sendMessage",
			clientUsername: clientUsername,
			stylistUsername: stylistUsername,
			sender: userContext.username,
			content: newMessage.trim(),
			createdAt: new Date().toISOString(),
		};

		ws.current.send(JSON.stringify(message));
		setMessageHistory((prevMessages) => [...prevMessages, message]);
		setNewMessage("");
	};

	const renderMessage = ({ item }) => {
		const isClient = item.sender === userContext.username;
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
			<KeyboardAvoidingView>
				<View style={styles.container}>
					<Text style={styles.header}>Chat with {username}</Text>
					<FlatList
						data={messageHistory}
						renderItem={renderMessage}
						keyExtractor={(item) =>
							item._id || Math.random().toString()
						}
						contentContainerStyle={styles.messagesList}
					/>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							value={newMessage}
							onChangeText={setNewMessage}
							placeholder="Type a message..."
							placeholderTextColor="#aaa"
						/>
						<TouchableOpacity
							style={styles.sendButton}
							onPress={sendMessage}
							disabled={!isConnected}
						>
							<Text style={styles.sendButtonText}>Send</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
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
	messagesList: {
		paddingBottom: 20,
	},
	inputContainer: {
		flexDirection: "row",
		padding: 10,
		backgroundColor: "#f9f9f9",
		borderTopWidth: 1,
		borderTopColor: "#ccc",
		alignItems: "center",
	},
	input: {
		flex: 1,
		height: 50,
		padding: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	sendButton: {
		marginLeft: 10,
		height: 50,
		borderRadius: 10,
		backgroundColor: "#007BFF",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	sendButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default ChatPage;
