// ChatPage.js
import React, { useState, useContext, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Image,
	Dimensions,
} from "react-native";
import { UserContext } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import SignupBackground from "../assets/components/SignupBackground";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have react-native-vector-icons installed

const ChatPage = () => {
	const { username, role } = useContext(UserContext);
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const scrollViewRef = useRef();

	// Mock messages data
	useEffect(() => {
		// Initialize with some mock messages
		const mockMessages = [
			{
				id: 1,
				sender: role === "client" ? "stylist" : "client",
				text:
					role === "client"
						? "Hello! How can I assist you today?"
						: "Hi! I’d like to book an appointment.",
				timestamp: new Date().getTime() - 60000, // 1 minute ago
			},
			{
				id: 2,
				sender: role === "client" ? "client" : "stylist",
				text:
					role === "client"
						? "I’m looking to get a haircut next week."
						: "Sure! What day works best for you?",
				timestamp: new Date().getTime() - 30000, // 30 seconds ago
			},
		];
		setMessages(mockMessages);
	}, [role]);

	// Function to handle sending a message
	const sendMessage = () => {
		if (inputText.trim() === "") return;

		const newMessage = {
			id: messages.length + 1,
			sender: role === "client" ? "client" : "stylist",
			text: inputText,
			timestamp: new Date().getTime(),
		};

		setMessages([...messages, newMessage]);
		setInputText("");

		// Scroll to bottom after sending a message
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	// Scroll to bottom when messages change
	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	// Placeholder for the chat partner's info
	const chatPartner = {
		name: role === "client" ? "Stylist Name" : "Client Name",
		profilePhoto: "https://via.placeholder.com/150", // Replace with actual URL or local asset
	};

	return (
		<SignupBackground>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<ProfilePhotoDisplay
						profilePhoto={chatPartner.profilePhoto}
						styleProp={styles.headerPhoto}
					/>
					<Text style={styles.headerName}>{chatPartner.name}</Text>
				</View>

				{/* Messages */}
				<ScrollView
					style={styles.messagesContainer}
					ref={scrollViewRef}
					contentContainerStyle={{ paddingVertical: 10 }}
				>
					{messages.map((message) => (
						<View
							key={message.id}
							style={[
								styles.messageBubble,
								message.sender === role
									? styles.myMessage
									: styles.theirMessage,
							]}
						>
							<Text style={styles.messageText}>
								{message.text}
							</Text>
							<Text style={styles.timestamp}>
								{new Date(message.timestamp).toLocaleTimeString(
									[],
									{
										hour: "2-digit",
										minute: "2-digit",
									}
								)}
							</Text>
						</View>
					))}
				</ScrollView>

				{/* Input Area */}
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={90}
				>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.textInput}
							placeholder="Type a message..."
							value={inputText}
							onChangeText={setInputText}
							multiline
						/>
						<TouchableOpacity
							style={styles.sendButton}
							onPress={sendMessage}
						>
							<Ionicons name="send" size={24} color="#fff" />
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</View>
		</SignupBackground>
	);
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	headerPhoto: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	headerName: {
		fontSize: 20,
		fontWeight: "bold",
	},
	messagesContainer: {
		flex: 1,
		marginVertical: 10,
	},
	messageBubble: {
		maxWidth: "80%",
		padding: 10,
		borderRadius: 15,
		marginVertical: 5,
	},
	myMessage: {
		backgroundColor: "#DCF8C6",
		alignSelf: "flex-end",
		borderTopRightRadius: 0,
	},
	theirMessage: {
		backgroundColor: "#FFF",
		alignSelf: "flex-start",
		borderTopLeftRadius: 0,
	},
	messageText: {
		fontSize: 16,
	},
	timestamp: {
		fontSize: 10,
		color: "#555",
		alignSelf: "flex-end",
		marginTop: 5,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "#ddd",
		padding: 5,
		backgroundColor: "#f9f9f9",
	},
	textInput: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontSize: 16,
		maxHeight: 100,
	},
	sendButton: {
		backgroundColor: "#007bff",
		borderRadius: 20,
		padding: 10,
		marginLeft: 5,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ChatPage;
