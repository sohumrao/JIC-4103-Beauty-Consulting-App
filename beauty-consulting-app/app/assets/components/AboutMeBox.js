import React, { useState, useContext } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import AgeIcon from "../images/birthday-cake.svg";
import PhoneIcon from "../images/phone-call.svg";
import EmailIcon from "../images/email.svg";
import GenderIcon from "../images/genders.svg";
import api from "utils/axios";
import { formatDate } from "../../utils/utils";
import { UserContext } from "../../contexts/userContext";
import handleHTTPError from "utils/errorHandling";
import globalStyles from "../GlobalStyles";
import EditProfileViewModal from "./EditProfileViewModal";

const AboutMeBox = ({ fieldValues, setFieldValues }) => {
	const userContext = useContext(UserContext);
	const [isEdit, setIsEdit] = useState(false);
	const [modalVisible, setModalVisible] = React.useState(false);

	const handleInputChange = (field, value) => {
		setFieldValues((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		try {
			const updatedData = {
				...fieldValues,
				username: userContext.username,
			};

			await api.put(`client/${userContext.username}`, updatedData);
			setIsEdit(false);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	// TODO: ifgure out if this needs to be handle edit or what
	const toggleEdit = () => {
		if (isEdit) {
			handleSave(); // Save on toggle if in edit mode
		}
		setIsEdit(!isEdit);
	};

	const openEditModal = () => {
		setModalVisible(true);
	};

	const closeEditModal = () => {
		setModalVisible(false);
	};

	console.log("LOGGING FROM ABOUT ME:", fieldValues);
	return (
		<View>
			<EditProfileViewModal
				visible={modalVisible}
				onClose={closeEditModal}
				profileDetails={fieldValues}
			/>
			<View style={styles.headerRow}>
				<Text style={styles.title}>About Me</Text>
				<TouchableOpacity
					style={globalStyles.button}
					onPress={openEditModal}
				>
					<Text style={globalStyles.buttonText}>Edit Profile</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
				<View style={styles.infoRow}>
					<AgeIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Birthday:</Text>
					{isEdit ? (
						<TextInput
							style={[styles.input, styles.value]}
							value={fieldValues.birthday}
							onChangeText={(value) =>
								handleInputChange("birthday", value)
							}
							keyboardType="numeric"
						/>
					) : (
						<Text style={styles.value}>
							{formatDate(fieldValues.birthday)}
						</Text>
					)}
				</View>

				<View style={styles.infoRow}>
					<PhoneIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Phone:</Text>
					{isEdit ? (
						<TextInput
							style={[styles.input, styles.value]}
							value={fieldValues.phoneNumber}
							onChangeText={(value) =>
								handleInputChange("phoneNumber", value)
							}
							keyboardType="phone-pad"
						/>
					) : (
						<Text style={styles.value}>
							{fieldValues.phoneNumber}
						</Text>
					)}
				</View>

				<View style={styles.infoRow}>
					<GenderIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Gender:</Text>
					{isEdit ? (
						<TextInput
							style={[styles.input, styles.value]}
							value={fieldValues.gender}
							onChangeText={(value) =>
								handleInputChange("gender", value)
							}
						/>
					) : (
						<Text style={styles.value}>{fieldValues.gender}</Text>
					)}
				</View>

				<View style={styles.infoRow}>
					<EmailIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Email:</Text>
					{isEdit ? (
						<TextInput
							style={[styles.input, styles.value]}
							value={fieldValues.email}
							onChangeText={(value) =>
								handleInputChange("email", value)
							}
							numberOfLines={1}
							ellipsizeMode="tail"
							keyboardType="email-address"
						/>
					) : (
						<Text
							style={styles.value}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{fieldValues.email}
						</Text>
					)}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
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

export default AboutMeBox;
