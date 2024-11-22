import React, { useContext, useEffect, useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import AboutMeBox from "../assets/components/AboutMeBox";
import AboutHairBox from "../assets/components/AboutHairBox";
import handleHTTPError from "utils/errorHandling";
import globalStyles from "../assets/GlobalStyles";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";
import ImageUploadButton from "../assets/components/ImageUploadButton";
import GoBackArrow from "../assets/images/go-back-arrow.svg";

const ProfileView = ({ route }) => {
	const { username } = route.params;
	const navigation = useNavigation();
	const userContext = useContext(UserContext);
	const [editable, setEditable] = useState(true);
	const [profile, setProfile] = useState();
	const [profileDetails, setProfileDetails] = useState({
		birthday: "",
		gender: "",
		phoneNumber: "",
		email: "",
	});
	const [photoChanged, setPhotoChanged] = useState(false);

	const fetchDetails = async (username) => {
		try {
			const res = await api.get(`/client/${username}`);
			setProfile(res.data);
			setProfileDetails({
				birthday: res.data?.info?.birthday || "",
				gender: res.data?.info?.gender || "",
				phoneNumber: res.data?.info?.phoneNumber || "",
				email: res.data?.email || "",
				profilePhoto: res.data?.profilePhoto || null,
				username: res.data?.username,
			});
		} catch (error) {
			handleHTTPError(error);
		}
	};

	useEffect(() => {
		setEditable(userContext.username == username);
		fetchDetails(username);
	});

	const deleteAccount = async () => {
		// TODO: update with a separate flow for password validation after backend rework
		try {
			await api.delete(`/client/${userContext.username}`);
			navigation.navigate("Sign In");
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<SignupBackground>
			<ScrollView>
				<View style={{ flex: 1 }}>
					<View
						style={{
							marginTop: 80,
						}}
					>
						{profileDetails.username !== userContext.username && (
							<TouchableOpacity
								onPress={() => {
									navigation.goBack();
								}}
							>
								<GoBackArrow
									width={36}
									height={36}
									fill={"black"}
									style={styles.editIcon}
								/>
							</TouchableOpacity>
						)}
						<ProfilePhotoDisplay
							profilePhoto={profileDetails.profilePhoto}
							styleProp={styles.photo}
						></ProfilePhotoDisplay>

						{profileDetails.username == userContext.username && (
							<ImageUploadButton
								username={userContext.username}
								photoChanged={photoChanged}
								setPhotoChanged={setPhotoChanged}
							></ImageUploadButton>
						)}
					</View>
					<View style={{}}>
						<AboutMeBox
							fieldValues={profileDetails}
							setFieldValues={setProfileDetails}
						/>
					</View>
					<View>
						<AboutHairBox />
					</View>
				</View>
				{profileDetails.username == userContext.username && (
					<TouchableOpacity
						style={globalStyles.button}
						onPress={deleteAccount}
					>
						<Text style={globalStyles.buttonText}>
							Delete Account
						</Text>
					</TouchableOpacity>
				)}
			</ScrollView>
		</SignupBackground>
	);
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	photo: {
		width: screenWidth * 0.5,
		height: screenWidth * 0.5, // Ensures height is equal to width
		borderRadius: (screenWidth * 0.5) / 2, // Half of the width for a perfect circle
		backgroundColor: "#e0e0e0",
		alignSelf: "center",
		borderWidth: 5,
	},
});

export default ProfileView;
