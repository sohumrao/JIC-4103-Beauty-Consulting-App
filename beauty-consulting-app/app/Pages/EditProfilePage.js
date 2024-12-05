import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import api from "utils/axios";

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
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.cancelButton}>Cancel</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Edit Profile</Text>
				<TouchableOpacity onPress={handleSave}>
					<Text style={styles.doneButton}>Done</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.formContainer}>
				<View style={styles.fieldContainer}>
					<Text style={styles.fieldLabel}>Email</Text>
					<TextInput
						style={styles.input}
						value={formData.email}
						onChangeText={(value) =>
							handleInputChange("email", value)
						}
						keyboardType="email-address"
						placeholder="Email"
					/>
				</View>

				<View style={styles.fieldContainer}>
					<Text style={styles.fieldLabel}>Phone</Text>
					<TextInput
						style={styles.input}
						value={formData.phoneNumber}
						onChangeText={(value) =>
							handleInputChange("phoneNumber", value)
						}
						keyboardType="phone-pad"
						placeholder="Phone Number"
					/>
				</View>

				<View style={styles.fieldContainer}>
					<Text style={styles.fieldLabel}>Birthday</Text>
					<DateTimePicker
						value={formData.birthday}
						mode="date"
						onChange={handleDateChange}
						style={styles.datePicker}
					/>
				</View>

				<View style={styles.fieldContainer}>
					<Text style={styles.fieldLabel}>Gender</Text>
					<View style={styles.genderContainer}>
						{["male", "female", "other"].map((gender) => (
							<TouchableOpacity
								key={gender}
								style={[
									styles.genderOption,
									formData.gender === gender &&
										styles.genderOptionSelected,
								]}
								onPress={() =>
									setFormData({ ...formData, gender })
								}
							>
								<Text
									style={[
										styles.genderText,
										formData.gender === gender &&
											styles.genderTextSelected,
									]}
								>
									{gender.charAt(0).toUpperCase() +
										gender.slice(1)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	cancelButton: {
		fontSize: 16,
		color: "#262626",
	},
	doneButton: {
		fontSize: 16,
		color: "#FF5252",
		fontWeight: "600",
	},
	formContainer: {
		flex: 1,
	},
	fieldContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
	},
	fieldLabel: {
		fontSize: 14,
		color: "#8e8e8e",
		marginBottom: 8,
	},
	input: {
		fontSize: 16,
		color: "#262626",
		padding: 0,
	},
	datePicker: {
		marginLeft: -8,
	},
	genderContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
	},
	genderOption: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#dbdbdb",
		marginHorizontal: 4,
		alignItems: "center",
	},
	genderOptionSelected: {
		backgroundColor: "#FF5252",
		borderColor: "#FF5252",
	},
	genderText: {
		color: "#262626",
		fontSize: 14,
	},
	genderTextSelected: {
		color: "#fff",
	},
});

export default EditProfileView;
