import React from "react";
import { View, Text } from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";

function ChatPage({ route }) {
	const { username } = route.params;

	return (
		<SignupBackground>
			<View>
				<Text>Conversations</Text>
				<Text>This is the chat page with {username}</Text>
			</View>
		</SignupBackground>
	);
}
export default ChatPage;
