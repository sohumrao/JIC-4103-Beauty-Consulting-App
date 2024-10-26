import { Feather } from "@expo/vector-icons";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	StyleSheet,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import handleHTTPError from "../errorHandling";

const StylistServices = ({ stylistData, setStylistData, editable }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [editingService, setEditingService] = useState(null);

	const [addModalVisible, setAddModalVisible] = useState(false);
	const [newService, setNewService] = useState({
		name: "",
		price: "",
		description: "",
	});

	const handleEditService = (service) => {
		setEditingService(service);
		setModalVisible(true);
	};

	const handleUpdateService = async () => {
		try {
			const apiURL = `${process.env.EXPO_PUBLIC_API_URL}:5050/stylist/service/${stylistData.username}`;
			const editedService = await axios.put(apiURL, editingService);

			// Update local state
			const updatedServices = stylistData.business.services.map(
				(service) =>
					service._id === editedService.data._id
						? editedService.data
						: service
			);
			setStylistData({
				...stylistData,
				business: {
					...stylistData.business,
					services: updatedServices,
				},
			});

			setModalVisible(false);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	const handleAddService = async () => {
		try {
			const apiURL = `${process.env.EXPO_PUBLIC_API_URL}:5050/stylist/service/${stylistData.username}`;
			const response = await axios.post(apiURL, newService);

			// Update local state
			setStylistData({
				...stylistData,
				business: {
					...stylistData.business,
					services: [...stylistData.business.services, response.data],
				},
			});

			setAddModalVisible(false);
			setNewService({ name: "", price: "", description: "" });
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<View style={styles.servicesContainer}>
			<View style={styles.serviceHeader}>
				<Text style={styles.label}>Services</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setAddModalVisible(true)}
				>
					<Feather name="plus" size={24} color="#3498db" />
				</TouchableOpacity>
			</View>
			{stylistData.business.services.map((service, index) => (
				<View key={index} style={styles.serviceItem}>
					<View style={styles.serviceHeader}>
						<View style={styles.serviceInfo}>
							<Text style={styles.serviceName}>
								{service.name}
							</Text>
							<Text style={styles.servicePrice}>
								${service.price.toFixed(2)}
							</Text>
						</View>
						{editable && (
							<TouchableOpacity
								style={styles.editButton}
								onPress={() => handleEditService(service)}
							>
								<Feather
									name="edit-2"
									size={20}
									color="#3498db"
								/>
							</TouchableOpacity>
						)}
					</View>
					{service.description && (
						<Text style={styles.serviceDescription}>
							{service.description}
						</Text>
					)}
				</View>
			))}
			{editable && (
				<>
					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => setModalVisible(false)}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<TextInput
									style={styles.input}
									value={editingService?.name}
									onChangeText={(text) =>
										setEditingService({
											...editingService,
											name: text,
										})
									}
									placeholder="Service Name"
								/>
								<TextInput
									style={styles.input}
									value={editingService?.price.toString()}
									onChangeText={(text) =>
										setEditingService({
											...editingService,
											price: parseFloat(text),
										})
									}
									placeholder="Price"
									keyboardType="numeric"
								/>
								<TextInput
									style={styles.input}
									value={editingService?.description}
									onChangeText={(text) =>
										setEditingService({
											...editingService,
											description: text,
										})
									}
									placeholder="Description"
									multiline
								/>
								<TouchableOpacity
									style={styles.button}
									onPress={handleUpdateService}
								>
									<Text style={styles.buttonText}>
										Update Service
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.button}
									onPress={() => setModalVisible(false)}
								>
									<Text style={styles.buttonText}>
										Cancel
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>

					<Modal
						animationType="slide"
						transparent={true}
						visible={addModalVisible}
						onRequestClose={() => setAddModalVisible(false)}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<TextInput
									style={styles.input}
									value={newService.name}
									onChangeText={(text) =>
										setNewService({
											...newService,
											name: text,
										})
									}
									placeholder="Service Name"
								/>
								<TextInput
									style={styles.input}
									value={newService.price.toString()}
									onChangeText={(text) =>
										setNewService({
											...newService,
											price: text,
										})
									}
									placeholder="Price"
									keyboardType="numeric"
								/>
								<TextInput
									style={styles.input}
									value={newService.description}
									onChangeText={(text) =>
										setNewService({
											...newService,
											description: text,
										})
									}
									placeholder="Description"
									multiline
								/>
								<TouchableOpacity
									style={styles.button}
									onPress={handleAddService}
								>
									<Text style={styles.buttonText}>
										Add Service
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.button}
									onPress={() => setAddModalVisible(false)}
								>
									<Text style={styles.buttonText}>
										Cancel
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</>
			)}
		</View>
	);
};
const styles = StyleSheet.create({
	label: {
		fontSize: 18,
		fontWeight: "bold",
	},
	servicesContainer: {
		marginTop: 20,
		paddingTop: 15,
	},
	sectionHeader: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#333",
	},
	serviceItem: {
		marginBottom: 15,
		padding: 15,
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	serviceHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	addButton: {
		padding: 5,
	},
	serviceInfo: {
		flex: 1,
	},
	serviceName: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2c3e50",
		marginBottom: 4,
	},
	servicePrice: {
		fontSize: 16,
		fontWeight: "600",
		color: "#27ae60",
	},
	serviceDescription: {
		fontSize: 14,
		color: "#7f8c8d",
		marginTop: 5,
	},
	editButton: {
		padding: 5,
	},
	editButtonText: {
		color: "#fff",
		textAlign: "center",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		width: 200,
	},
	button: {
		backgroundColor: "#2196F3",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		marginTop: 10,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default StylistServices;
