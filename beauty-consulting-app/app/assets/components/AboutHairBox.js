import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HairIcon from "../images/hair-icon.svg";
import Comb from "../images/comb.svg";
import Allergies from "../images/allergies.svg";
import Concerns from "../images/concerns.svg";
import EditImage from "../images/pen.svg";

const HairDetailsBox = ({ hairDetails, allergies, concerns }) => {
	return (
		<View>
			<View style={styles.headerRow}>
				<Text style={styles.title}>My Hair</Text>
				<EditImage width={24} height={24} style={styles.editIcon} />
			</View>
			<View style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.infoRow}>
						<HairIcon width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Hair Type:</Text>
						<Text style={styles.value}>{hairDetails.type}</Text>
					</View>
					<View style={styles.infoRow}>
						<Comb width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Texture:</Text>
						<Text style={styles.value}>{hairDetails.texture}</Text>
					</View>
					<View style={styles.infoRow}>
						<Allergies width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Allergies:</Text>
						<Text
							style={styles.value}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{allergies}
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
							{concerns}
						</Text>
					</View>
				</ScrollView>
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
		maxHeight: 300,
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
});

export default HairDetailsBox;
