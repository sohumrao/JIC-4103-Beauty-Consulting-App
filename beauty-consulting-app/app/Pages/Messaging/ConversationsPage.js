import React, { useContext } from "react";
import { View, Text } from "react-native";
import SignupBackground from "../../assets/components/SignupBackground";
import { UserContext } from "../../contexts/userContext";

function ConversationsPage() {
	const userContext = useContext(UserContext);

	return (
		<SignupBackground>
			<View>
				<Text>Conversations</Text>
				<Text>
					This is the conversations page for {userContext.username}
				</Text>
			</View>
		</SignupBackground>
	);
}
export default ConversationsPage;
