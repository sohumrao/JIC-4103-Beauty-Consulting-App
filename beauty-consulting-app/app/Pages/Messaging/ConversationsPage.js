import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SignupBackground from "../../assets/components/SignupBackground";
import { UserContext } from "../../contexts/userContext";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import ConversationList from "../../assets/components/ConversationList";

function ConversationsPage() {
	const userContext = useContext(UserContext);
	const [errorMessage, setErrorMessage] = useState("");
	const [recentMessages, setRecentMessages] = useState();

	const fetchMessages = async () => {
		try {
			const response = await api.get("/messages/recent", {
				params: {
					username: userContext.username,
				},
			});
			console.log(userContext.username);
			setRecentMessages(response.data);
		} catch (error) {
			handleHTTPError(error, setErrorMessage);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchMessages();
		}, [])
	);

	return (
		<SignupBackground>
			<View style={styles.container}>
				<Text style={styles.header}>Conversations</Text>
				<ConversationList conversations={recentMessages} />
				{errorMessage ? (
					<Text style={styles.error}>{errorMessage}</Text>
				) : null}
			</View>
		</SignupBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginVertical: 15,
		marginLeft: 15,
	},
	error: {
		color: "red",
		marginTop: 10,
		textAlign: "center",
	},
});

export default ConversationsPage;
