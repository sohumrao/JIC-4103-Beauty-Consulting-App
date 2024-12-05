import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AgeIcon from "../images/birthday-cake.svg";
import PhoneIcon from "../images/phone-call.svg";
import EmailIcon from "../images/email.svg";
import GenderIcon from "../images/genders.svg";
import HairIcon from "../images/hair-icon.svg";
import Allergies from "../images/allergies.svg";
import Concerns from "../images/concerns.svg";
import { formatDate } from "../../utils/utils";
import globalStyles from "../GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const AboutMeBox = ({ fieldValues, onEdit, hairProfile, editable }) => {
	const formatHairDetails = (hairDetails) => {
		return Object.entries(hairDetails)
			.filter(([key, value]) => value === true)
			.map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
			.join(", ");
	};

	return (
		<View>
			<View style={styles.headerRow}>
				<Text style={styles.title}>About Me</Text>
				<TouchableOpacity onPress={onEdit}>
					<Ionicons
						name="pencil"
						size={24}
						color="#000"
						style={styles.editIcon}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
				<View style={styles.infoRow}>
					<AgeIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Birthday:</Text>
					<Text style={styles.value}>
						{formatDate(fieldValues.birthday)}
					</Text>
				</View>

				<View style={styles.infoRow}>
					<PhoneIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Phone:</Text>
					<Text style={styles.value}>{fieldValues.phoneNumber}</Text>
				</View>

				<View style={styles.infoRow}>
					<GenderIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Gender:</Text>
					<Text style={styles.value}>{fieldValues.gender}</Text>
				</View>

				<View style={styles.infoRow}>
					<EmailIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Email:</Text>
					<Text
						style={styles.value}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{fieldValues.email}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<HairIcon width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Hair Type:</Text>
					<Text style={styles.value}>
						{formatHairDetails(hairProfile.hairDetails || {})}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<Allergies width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Allergies:</Text>
					<Text
						style={styles.value}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{hairProfile.allergies || "None"}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<Concerns width={20} height={20} style={styles.icon} />
					<Text style={styles.label}>Concerns:</Text>
					<Text
						style={styles.value}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{hairProfile.concerns || "None"}
					</Text>
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
