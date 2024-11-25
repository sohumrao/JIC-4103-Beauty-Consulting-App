import React, { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	RefreshControl,
	Dimensions,
	Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SignupBackground from "../../assets/components/SignupBackground";
import { UserContext } from "../../contexts/userContext";
import api from "utils/axios";
import handleHTTPError from "utils/errorHandling";
import ConversationList from "../../assets/components/ConversationList";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

function ConversationsPage() {
	const userContext = useContext(UserContext);
	const [errorMessage, setErrorMessage] = useState("");
	const [recentMessages, setRecentMessages] = useState();
	const [refreshing, setRefreshing] = useState(false);

	const fetchMessages = async () => {
		try {
			const response = await api.get("/messages/recent", {
				params: {
					username: userContext.username,
				},
			});
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

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		fetchMessages().then(() => setRefreshing(false));
	}, []);

	return (
		<SignupBackground>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Header Bar */}
					<View style={styles.headerBar}>
						{/* Profile Photo */}
						{userContext.userProfile?.profilePhoto ? (
							<Image
								source={{
									uri: userContext.userProfile.profilePhoto,
								}}
								style={styles.profilePhoto}
							/>
						) : (
							<View style={styles.placeholderPhoto}>
								<Ionicons
									name="person"
									size={24}
									color="#fff"
								/>
							</View>
						)}
						{/* Title */}
						<Text style={styles.headerTitle}>Conversations</Text>
						{/* Placeholder for balancing the header layout */}
						<View style={styles.headerRightPlaceholder} />
					</View>
					{/* End of Header Bar */}

					{/* Main Content */}
					<ScrollView
						contentContainerStyle={styles.scrollContainer}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								colors={["#007bff"]} // Android
								tintColor="#007bff" // iOS
							/>
						}
					>
						<ConversationList conversations={recentMessages} />
						{errorMessage ? (
							<Text style={styles.error}>{errorMessage}</Text>
						) : null}
					</ScrollView>
					{/* End of Main Content */}
				</View>
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
		width: "100%",
		paddingHorizontal: 20,
	},
	headerBar: {
		height: 60,
		width: 350,
		backgroundColor: "#fa4e41",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		marginBottom: 10,
		alignSelf: "center",
	},
	profilePhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
	},
	placeholderPhoto: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#555",
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
	},
	headerRightPlaceholder: {
		width: 40,
	},
	scrollContainer: {
		paddingBottom: 20,
	},
	error: {
		color: "red",
		marginTop: 10,
		textAlign: "center",
	},
});

export default ConversationsPage;
