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
import handleHTTPError from "utils/errorHandling";
import api from "utils/axios";

const StylistServices = ({ stylistData, setStylistData, editable }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [editingService, setEditingService] = useState(null);

	const [addModalVisible, setAddModalVisible] = useState(false);
	const [newService, setNewService] = useState({
		name: "",
		price: "",
		description: "",
	});

	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [serviceToDelete, setServiceToDelete] = useState(null);

	const handleEditService = (service) => {
		setEditingService(service);
		setModalVisible(true);
	};

	const handleUpdateService = async () => {
		try {
			const editedService = await api.put(
				`/stylist/service/${stylistData.username}`,
				editingService
			);

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
			const response = await api.post(
				`/stylist/service/${stylistData.username}`,
				newService
			);

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
	const handleDeleteService = (service) => {
		setServiceToDelete(service);
		setDeleteModalVisible(true);
	};

	const confirmDeleteService = async () => {
		if (!serviceToDelete) return;

		try {
			await api.delete(`/stylist/service/${stylistData.username}`, {
				data: { _id: serviceToDelete._id },
			});

			// Update local state
			setStylistData({
				...stylistData,
				business: {
					...stylistData.business,
					services: stylistData.business.services.filter(
						(service) => service._id !== serviceToDelete._id
					),
				},
			});

			setDeleteModalVisible(false);
			setServiceToDelete(null);
		} catch (error) {
			handleHTTPError(error);
		}
	};

	return (
		<View style={styles.servicesContainer}>
			<View style={styles.serviceHeader}>
				<Text style={styles.label}>Services</Text>
				{editable && (
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => setAddModalVisible(true)}
					>
						<Feather name="plus" size={24} color="#3498db" />
					</TouchableOpacity>
				)}
			</View>
			{stylistData.business.services.map((service) => (
				<View key={service._id} style={styles.serviceItem}>
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
							<View style={styles.serviceActions}>
								<TouchableOpacity
									style={styles.actionButton}
									onPress={() => handleEditService(service)}
								>
									<Feather
										name="edit-2"
										size={20}
										color="#3498db"
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.actionButton}
									onPress={() => handleDeleteService(service)}
								>
									<Feather
										name="trash-2"
										size={20}
										color="#e74c3c"
									/>
								</TouchableOpacity>
							</View>
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
								<Text style={styles.inputLabel}>
									Service Name
								</Text>
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
								<Text style={styles.inputLabel}>Price</Text>
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
								<Text style={styles.inputLabel}>
									Description
								</Text>
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
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonCancel,
										]}
										onPress={() => setModalVisible(false)}
									>
										<Text style={styles.buttonText}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonConfirm,
										]}
										onPress={handleUpdateService}
									>
										<Text style={styles.buttonText}>
											Update Service
										</Text>
									</TouchableOpacity>
								</View>
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
								<Text style={styles.inputLabel}>
									Service Name
								</Text>
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
								<Text style={styles.inputLabel}>Price</Text>
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
								<Text style={styles.inputLabel}>
									Description
								</Text>
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
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonCancel,
										]}
										onPress={() =>
											setAddModalVisible(false)
										}
									>
										<Text style={styles.buttonText}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonConfirm,
										]}
										onPress={handleAddService}
									>
										<Text style={styles.buttonText}>
											Add Service
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<Modal
						animationType="fade"
						transparent={true}
						visible={deleteModalVisible}
						onRequestClose={() => setDeleteModalVisible(false)}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>
									Are you sure you want to delete
									{` ${serviceToDelete?.name}?`}
								</Text>
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonCancel,
										]}
										onPress={() =>
											setDeleteModalVisible(false)
										}
									>
										<Text style={styles.buttonText}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.button,
											styles.buttonDelete,
										]}
										onPress={confirmDeleteService}
									>
										<Text style={styles.buttonText}>
											Delete
										</Text>
									</TouchableOpacity>
								</View>
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
		alignItems: "flex-start",
		marginBottom: 8,
	},
	serviceInfo: {
		flex: 1,
	},
	serviceActions: {
		flexDirection: "row",
	},
	actionButton: {
		padding: 5,
		marginLeft: 10,
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
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 10,
		width: "100%",
		backgroundColor: "#fff",
	},
	inputLabel: {
		textAlign: "left",
		fontWeight: "bold",
		alignSelf: "flex-start",
		width: "100%",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "90%",
		maxWidth: 400,
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		color: "#2c3e50",
	},
	serviceNameText: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		marginTop: 20,
		gap: 10,
	},
	button: {
		borderRadius: 12,
		padding: 12,
		elevation: 2,
		flex: 0.5,
		maxWidth: 150,
	},
	buttonCancel: {
		backgroundColor: "#95a5a6",
	},
	buttonConfirm: {
		backgroundColor: "#3498db",
	},
	buttonDelete: {
		backgroundColor: "#e74c3c",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 16,
	},
});

export default StylistServices;
