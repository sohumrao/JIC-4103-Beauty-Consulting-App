import React from "react";
import { Image, View, StyleSheet } from "react-native";
import DefaultProfilePicture from "../images/profile-user.svg";

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
		position: "absolute",
	},
	profileImage: {
		width: 160,
		height: 160,
		borderRadius: 90,
		borderWidth: 2,
		borderColor: "#000",
	},
});

export default ProfilePicture;
