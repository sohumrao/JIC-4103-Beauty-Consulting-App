import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HairIcon from "../images/hair-icon.svg";
import Allergies from "../images/allergies.svg";
import Concerns from "../images/concerns.svg";
import EditImage from "../images/pen.svg";
import { UserContext } from "../../contexts/userContext";

const HairDetailsBox = () => {
	const userContext = useContext(UserContext);

	const [hairTypes, setHairTypes] = React.useState([]);
	const [allergies, setAllergies] = React.useState("");
	const [concerns, setConcerns] = React.useState("");

	useEffect(() => {
		console.log(userContext);
		if (userContext?.hairDetails) {
			const types = Object.entries(userContext.hairDetails || {})
				.filter(([key, value]) => value === true)
				.map(([key]) => key)
				.join(", ");

			setHairTypes(types);
			setAllergies(userContext.allergies || "");
			setConcerns(userContext.concerns || "");
			console.log(hairTypes);
		}
	}, [userContext]);

	return (
		<View>
			<View style={styles.headerRow}>
				<Text style={styles.title}>My Hair</Text>
			</View>
			<View style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.infoRow}>
						<HairIcon width={20} height={20} style={styles.icon} />
						<Text style={styles.label}>Hair Type:</Text>
						<Text style={styles.value}>{hairTypes}</Text>
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
		fontSize: 18,
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
		fontSize: 16,
		width: "30%",
	},
	value: {
		fontSize: 16,
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
