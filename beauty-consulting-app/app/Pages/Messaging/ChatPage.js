import React, { useContext, useState, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	Image,
} from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import { UserContext } from "../../contexts/userContext";
import MessageBubble from "../../assets/components/MessageBubble";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

function ChatPage({ route }) {
	const { username, stylistUsername, clientUsername } = route.params;
	const userContext = useContext(UserContext);
	const [messageHistory, setMessageHistory] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const ws = useRef(null);
	const [isConnected, setIsConnected] = useState(false);
	const navigation = useNavigation();

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
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.headerBar}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color="#fff" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Chat with {username}</Text>
					<View style={styles.headerRightPlaceholder} />
				</View>
				{/* Main Content */}
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
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
							<Ionicons
								name="send"
								style={styles.sendButtonIcon}
							/>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SignupBackground>
	);
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		padding: 10,
	},
	headerBar: {
		height: 60,
		width: "100%",
		backgroundColor: "#fa4e41", // Primary color
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		marginBottom: 10, // Space between header and content
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRightPlaceholder: {
		width: 40,
	},
	messagesList: {
		paddingBottom: 20,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#f2f2f2",
		borderRadius: 30,
		marginHorizontal: 10,
		marginVertical: 5,
		elevation: 1, // Add subtle shadow for Android
		shadowColor: "#000", // Shadow for iOS
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	input: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		backgroundColor: "#fff",
		borderRadius: 25,
		borderWidth: 0, // Remove border for a clean look
		elevation: 0,
	},
	sendButton: {
		marginLeft: 10,
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: "#007BFF",
		justifyContent: "center",
		alignItems: "center",
	},
	sendButtonIcon: {
		color: "#fff",
		fontSize: 20,
	},
});

export default ChatPage;
