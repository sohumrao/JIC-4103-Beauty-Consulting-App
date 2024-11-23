import React, { useState, useEffect, useContext } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";
import globalStyles from "../GlobalStyles";
import AgeIcon from "../images/birthday-cake.svg";
import PhoneIcon from "../images/phone-call.svg";
import EmailIcon from "../images/email.svg";
import GenderIcon from "../images/genders.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext, updateUserContext } from "../../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import api from "utils/axios";
import { RadioButton } from "react-native-paper";

const EditProfileViewModal = ({ visible, onClose, profileDetails }) => {
	const [formData, setFormData] = useState({
		birthday: new Date(), // default to current date
		gender: "",
		phoneNumber: "",
		email: "",
	});

	const userContext = useContext(UserContext);

	useEffect(() => {
		if (profileDetails) {
			setFormData({
				birthday: new Date(profileDetails.birthday),
				gender: profileDetails.gender,
				phoneNumber: profileDetails.phoneNumber,
				email: profileDetails.email,
			});
		}
	}, [profileDetails]);

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

	const saveAndClose = async () => {
		updatedData = {
			email: formData.email,
			info: {
				phoneNumber: formData.phoneNumber,
				gender: formData.gender,
				birthday: formData.birthday,
			},
		};
		try {
			await api.put(`client/${userContext.username}`, updatedData);
		} catch (error) {
			handleHTTPError(error);
		}
		onClose(formData);
	};

	// FIXME: styling is ugly
	return (
		<Modal visible={visible} transparent={false} animationType="slide">
			<View style={styles.headerRow}>
				<Text style={styles.title}>Edit Details</Text>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={saveAndClose}
				>
					<Text style={globalStyles.buttonText}>Save Edits</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
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
						defaultValue={formData.phoneNumber}
						keyboardType="phone-pad"
						onChangeText={(value) =>
							handleInputChange("phoneNumber", value)
						}
					/>
				</View>

				<View style={styles.infoRow}>
					<GenderIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Gender:</Text>
					<View style={styles.radioContainer}>
						<RadioButton
							value="male"
							status={
								formData.gender === "male"
									? "checked"
									: "unchecked"
							}
							onPress={() =>
								setFormData({ ...formData, gender: "male" })
							}
						/>
						<Text>Male</Text>
						<RadioButton
							value="female"
							status={
								formData.gender === "female"
									? "checked"
									: "unchecked"
							}
							onPress={() =>
								setFormData({ ...formData, gender: "female" })
							}
						/>
						<Text>Female</Text>
						<RadioButton
							value="other"
							status={
								formData.gender === "other"
									? "checked"
									: "unchecked"
							}
							onPress={() =>
								setFormData({ ...formData, gender: "other" })
							}
						/>
						<Text>Other</Text>
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
						numberOfLines={1}
						ellipsizeMode="tail"
						keyboardType="email-address"
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centerContainer: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		marginTop: 100,
	},
	container: {
		padding: 5,
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#000",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		marginTop: 10,
	},
	label: {
		fontWeight: "bold",
		fontSize: 20,
		width: "30%",
	},
	value: {
		fontSize: 20,
		fontWeight: "bold",
		width: "55%",
		flexGrow: 1,
		textAlign: "right",
	},
	icon: {
		marginRight: 10,
	},
	editIcon: {
		marginLeft: 10,
	},
	input: {
		borderBottomWidth: 1,
		fontSize: 18,
		width: "55%",
	},
	radioContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
});

export default EditProfileViewModal;
