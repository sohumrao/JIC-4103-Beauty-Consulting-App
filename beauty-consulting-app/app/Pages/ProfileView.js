import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import AboutMeBox from "../assets/components/AboutMeBox";
import AboutHairBox from "../assets/components/AboutHairBox";
import ProfilePicture from "../assets/components/ProfilePicture";
import handleHTTPError from "utils/errorHandling";

const ProfileView = () => {
	const navigation = useNavigation();

	var userContext = useContext(UserContext);
	var [name, setName] = useState("");
	var [age, setAge] = useState("");
	var [gender, setGender] = useState("");
	var [phoneNumber, setPhoneNumber] = useState("");
	var [allergies, setAllergies] = useState("");
	var [concerns, setConcerns] = useState("");
	var [isEdit, setIsEdit] = useState(false);

	const { profilePicture } = useContext(UserContext);

	const fetchDetails = async () => {
		try {
			const res = await api.get(`/client/${userContext.username}`);
			const data = res.data;
			userContext = userContext.updateUserContext({
				...userContext,
				...data,
			});
		} catch (error) {
			handleHTTPError(error);
			console.error("Error with request: ", error);
		}
	};

	useEffect(() => {
		fetchDetails();
	}, []);

	const handleEdit = async () => {
		name = name != "" ? name : userContext.name;
		gender = gender != "" ? gender : userContext.gender;
		allergies = allergies != "" ? allergies : userContext.allergies;
		concerns = concerns != "" ? concerns : userContext.concerns;

		if (isEdit) {
			try {
				const req = {
					username: userContext.username,
					name: name,
					age: userContext.age,
					gender: gender,
					phoneNumber: userContext.phoneNumber,
					email: userContext.email,
					hairDetails: userContext.hairDetails,
					allergies: allergies,
					concerns: concerns,
				};
				const res = await api.put(
					`/client/${userContext.username}`,
					req
				);
				console.log("update successful: ", res.data);
			} catch (error) {
				console.error("Error with request: ", error);
			}

			// update user context for rest of session
			userContext = userContext.updateUserContext({
				username: userContext.username,
				name: name,
				age: age,
				gender: gender,
				phoneNumber: userContext.phoneNumber,
				email: userContext.email,
				hairDetails: userContext.hairDetails,
				allergies: allergies,
				concerns: concerns,
				updateUserContext: userContext.updateUserContext,
			});
		}
		setIsEdit(!isEdit);
	};

	const deleteAccount = async () => {
		// TODO: update with a separate flow for password validation after backend rework

		try {
			console.log(userContext);
			const res = api.delete(`/client/${userContext.username}`);
			console.log(res.message);
		} catch (error) {
			console.error("Error with request: ", error);
			return;
		}
		navigation.navigate("Sign In");
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
					>
						<ProfilePicture picture={profilePicture} />
					</View>
					<View style={{ marginTop: 180 }}>
						<AboutMeBox
							userContext={userContext}
							onUpdateUser={(updatedUser) =>
								userContext.updateUserContext(updatedUser)
							}
						/>
					</View>
					<View>
						<AboutHairBox />
					</View>
				</View>
			</ScrollView>
		</SignupBackground>
	);
};

export default ProfileView;
