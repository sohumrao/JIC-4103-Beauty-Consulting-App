import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import AboutMeBox from "../assets/components/AboutMeBox";
import AboutHairBox from "../assets/components/AboutHairBox";
import handleHTTPError from "utils/errorHandling";
import globalStyles from "../assets/GlobalStyles";

const ProfileView = (routeObject) => {
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

	const fetchDetails = async (username) => {
		try {
			const res = await api.get(`/client/${username}`);
			setProfile(res.data);
			setProfileDetails({
				birthday: res.data?.info?.birthday || "",
				gender: res.data?.info?.gender || "",
				phoneNumber: res.data?.info?.phoneNumber || "",
				email: res.data?.email || "",
			});
		} catch (error) {
			handleHTTPError(error);
		}
	};

	useEffect(() => {
		setEditable(userContext.username == routeObject.route.params.username);
		fetchDetails(routeObject.route.params.username);
	}, [routeObject]);

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
							flexDirection: "row",
							alignItems: "flex-start",
							marginTop: 100,
							marginLeft: 20,
						}}
					></View>
					<View style={{ marginTop: 180 }}>
						<AboutMeBox
							fieldValues={profileDetails}
							setFieldValues={setProfileDetails}
						/>
					</View>
					<View>
						<AboutHairBox />
					</View>
				</View>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={deleteAccount}
				>
					<Text style={globalStyles.buttonText}>Delete Account</Text>
				</TouchableOpacity>
			</ScrollView>
		</SignupBackground>
	);
};

export default ProfileView;
