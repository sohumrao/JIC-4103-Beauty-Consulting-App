import React from "react";
import { Image, View, StyleSheet } from "react-native";
import DefaultProfilePicture from "../images/profile-user.svg"; // Ensure this path is correct

const ProfilePicture = ({ picture }) => {
	return (
		<View style={styles.container}>
			{picture ? (
				<Image
					source={{ uri: picture }}
					style={styles.profileImage}
					resizeMode="cover"
				/>
			) : (
				<DefaultProfilePicture
					width={160}
					height={160}
					style={styles.defaultProfileImage}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// Adjust container styles as needed
	},
	profileImage: {
		width: 160,
		height: 160,
		borderRadius: 80, // Make it circular
		borderWidth: 2,
		borderColor: "#000",
	},
	defaultProfileImage: {
		// Styles for the default SVG if needed
	},
});

export default ProfilePicture;
