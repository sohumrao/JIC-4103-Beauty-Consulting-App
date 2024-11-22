import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from "react-native";
import globalStyles from "../GlobalStyles";

const EditProfileViewModal = ({ visible, onClose, profileDetails }) => {
	return (
		<Modal
			visible={visible}
			transparent={false}
			animationType="slide"
		></Modal>
	);
};
export default EditProfileViewModal;
