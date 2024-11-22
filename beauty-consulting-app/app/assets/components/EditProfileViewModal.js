import React, { useState, useEffect, useContext } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	TextInput,
} from "react-native";
import globalStyles from "../GlobalStyles";
import SignupBackground from "./SignupBackground";
import AgeIcon from "../images/birthday-cake.svg";
import PhoneIcon from "../images/phone-call.svg";
import EmailIcon from "../images/email.svg";
import GenderIcon from "../images/genders.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext, updateUserContext } from "../../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import { formatDate } from "../../utils/utils";
import api from "utils/axios";
import dayjs from "dayjs";

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
				birthday: dayjs(profileDetails.birthday).toDate(),
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
		userContext.updateUserContext({
			...userContext,
			email: formData.email,
			info: {
				phoneNumber: formData.phoneNumber,
				gender: formData.gender,
				birthday: formData.birthday,
			},
		});

		updatedData = userContext;
		console.log("UPDATED DATA: ", updatedData);
		try {
			await api.put(`client/${userContext.username}`, updatedData);
		} catch (error) {
			handleHTTPError(error);
		}
		onClose();
	};

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
					<TextInput
						style={[styles.input, styles.value]}
						value={formData.gender}
						onChangeText={(value) =>
							handleInputChange("gender", value)
						}
					/>
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
});

export default EditProfileViewModal;
