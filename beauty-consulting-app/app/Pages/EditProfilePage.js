import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../assets/GlobalStyles";
import AgeIcon from "../assets/images/birthday-cake.svg";
import PhoneIcon from "../assets/images/phone-call.svg";
import EmailIcon from "../assets/images/email.svg";
import GenderIcon from "../assets/images/genders.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import api from "utils/axios";
import { RadioButton } from "react-native-paper";
import SignupBackground from "../assets/components/SignupBackground";
import { Profiler } from "react-native-calendars";

const EditProfileView = ({ route }) => {
	const { profileDetails: initialProfileDetails, setProfileDetails } =
		route.params;
	const navigation = useNavigation();
	const userContext = useContext(UserContext);

	const [formData, setFormData] = useState({
		birthday: new Date(),
		gender: "",
		phoneNumber: "",
		email: "",
	});

	useEffect(() => {
		if (initialProfileDetails) {
			setFormData({
				birthday: new Date(initialProfileDetails.birthday),
				gender: initialProfileDetails.gender,
				phoneNumber: initialProfileDetails.phoneNumber,
				email: initialProfileDetails.email,
			});
		}
	}, [initialProfileDetails]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleDateChange = (event, selectedDate) => {
		if (event.type === "set") {
			const currentDate = selectedDate || formData.birthday;
			setFormData((prev) => ({
				...prev,
				birthday: currentDate,
			}));
		}
	};

	const handleSave = async () => {
		const updatedData = {
			email: formData.email,
			info: {
				phoneNumber: formData.phoneNumber,
				gender: formData.gender,
				birthday: formData.birthday,
			},
		};

		try {
			await api.put(`client/${userContext.username}`, updatedData);
			setProfileDetails({
				...initialProfileDetails,
				birthday: formData.birthday,
				gender: formData.gender,
				phoneNumber: formData.phoneNumber,
				email: formData.email,
			});
			navigation.goBack();
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<SignupBackground>
			<SafeAreaView style={styles.container}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>Edit Profile</Text>
					<TouchableOpacity
						style={globalStyles.button}
						onPress={handleSave}
					>
						<Text style={globalStyles.buttonText}>
							Save Changes
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.formContainer}>
					<View style={styles.infoRow}>
						<AgeIcon width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Birthday:</Text>
						<DateTimePicker
							value={formData.birthday}
							mode="date"
							onChange={handleDateChange}
						/>
					</View>

					<View style={styles.infoRow}>
						<PhoneIcon width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Phone:</Text>
						<TextInput
							style={[styles.input, styles.value]}
							value={formData.phoneNumber}
							keyboardType="phone-pad"
							onChangeText={(value) =>
								handleInputChange("phoneNumber", value)
							}
						/>
					</View>

					<View style={styles.infoRow}>
						<GenderIcon
							width={20}
							height={20}
							style={styles.icon}
						/>
						<Text style={styles.label}>Gender:</Text>
						<View style={styles.radioContainer}>
							{["male", "female", "other"].map((gender) => (
								<View key={gender} style={styles.radioOption}>
									<RadioButton
										value={gender}
										status={
											formData.gender === gender
												? "checked"
												: "unchecked"
										}
										onPress={() =>
											setFormData({ ...formData, gender })
										}
									/>
									<Text style={styles.radioLabel}>
										{gender.charAt(0).toUpperCase() +
											gender.slice(1)}
									</Text>
								</View>
							))}
						</View>
					</View>

					<View style={styles.infoRow}>
						<EmailIcon width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Email:</Text>
						<TextInput
							style={[styles.input, styles.value]}
							value={formData.email}
							onChangeText={(value) =>
								handleInputChange("email", value)
							}
							keyboardType="email-address"
						/>
					</View>
				</View>
			</SafeAreaView>
		</SignupBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		marginTop: 40,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 30,
	},
	formContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	label: {
		fontWeight: "bold",
		fontSize: 16,
		width: "30%",
	},
	value: {
		fontSize: 16,
		flexGrow: 1,
	},
	icon: {
		marginRight: 10,
	},
	input: {
		borderBottomWidth: 1,
		padding: 5,
	},
	radioContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	radioOption: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
	},
	radioLabel: {
		fontSize: 16,
	},
});

export default EditProfileView;
