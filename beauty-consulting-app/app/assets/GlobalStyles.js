import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: "#fff",
	},
	centeringContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	box: {
		width: "80%",
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 15,
		width: "100%",
	},
	button: {
		backgroundColor: "#FF5252",
		paddingVertical: 10,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	linkText: {
		color: "#FF5252",
		textAlign: "center",
		marginTop: 10,
	},
	inputHeaderText: {
		color: "#FF5252",
	},
	promptText: {
		textAlign: "center",
		marginTop: 20,
	},
	stepIndicatorContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	step: {
		flex: 1,
		height: 5,
		backgroundColor: "#eee",
		borderRadius: 2.5,
		marginHorizontal: 2,
	},
	stepCompleted: {
		backgroundColor: "red",
	},
	bubbleContainer: {
		flexDirection: "row",
		padding: 20,
		backgroundColor: "#fff",
	},
	stylistListingContainer: {
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		padding: 10,
		marginVertical: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.4,
		shadowRadius: 5,
		elevation: 5,
	},
	directoryContainer: {},
	stylistImage: {
		width: 80, // Fixed width for the image
		height: 80, // Fixed height for the image
		borderRadius: 40, // Make the image circular
		marginRight: 15, // Spacing between image and text
		backgroundColor: "#e0e0e0", // Fallback background color
	},
	listingTextContainer: {
		flex: 1, // Allow text to take remaining space
		justifyContent: "center", // Vertically align text
	},
	stylistName: {
		fontSize: 20, // Largest text size for the stylist's name
		fontWeight: "bold", // Bold for emphasis
		color: "#333", // Dark color for the name
		marginBottom: 5, // Space between name and business name
	},
	businessName: {
		fontSize: 16, // Medium text size for business name
		color: "#555", // Slightly lighter color
		marginBottom: 3, // Space between business name and address
	},
	businessAddress: {
		fontSize: 14, // Small text size for the address
		color: "#777", // Light color for the address
	},
	directoryHeaderContainer: {
		paddingTop: 40,
		backgroundColor: "#FF5252",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		borderRadius: 5,
	},
	directoryHeaderText: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		paddingBottom: 10,
	},
});

export default globalStyles;
