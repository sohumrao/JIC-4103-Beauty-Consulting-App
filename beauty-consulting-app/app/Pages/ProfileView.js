import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/userContext";
import SignupBackground from "../assets/components/SignupBackground";
import api from "utils/axios";
import AboutMeBox from "../assets/components/AboutMeBox";
import AboutHairBox from "../assets/components/AboutHairBox";
import handleHTTPError from "utils/errorHandling";
import ProfilePhotoDisplay from "../assets/components/ProfilePhotoDisplay";

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
			console.log("RETURNED DATA: ", data);
			const updatedContext = {
				...userContext,
				info: {
					...data.info,
				},
				hairDetails: data.hairDetails,
				email: data.email,
				allergies: data.allergies,
				concerns: data.concerns,
				profilePicture: data.profilePhoto,
			};
			userContext = userContext.updateUserContext(updatedContext);
			console.log("USER CONTEXT: " + userContext);
		} catch (error) {
			handleHTTPError(error);
			console.error("Error with request: ", error);
		}
	};

	useEffect(() => {
		fetchDetails();
	}, []);

	const handleEdit = async () => {
		console.log("called!");
		if (isEdit) {
			try {
				const req = {
					username: userContext.username,
					name: name,
					info: {
						gender: gender || userContext.info.gender,
						phoneNumber:
							phoneNumber || userContext.info.phoneNumber,
						email: userContext.info.email,
						birthday: userContext.info.birthday,
					},
					hairDetails: userContext.hairDetails,
					allergies: allergies || userContext.allergies,
					concerns: concerns || userContext.concerns,
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
				info: {
					gender: gender,
					phoneNumber: phoneNumber,
					email: userContext.info.email,
					birthday: userContext.info.birthday,
				},
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
					></View>
					<View style={{ marginTop: 180 }}>
						<AboutMeBox
							userContext={userContext}
							onUpdateUser={(updatedUser) =>
								userContext.updateUserContext(updatedUser)
							}
							handleEdit={handleEdit}
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
