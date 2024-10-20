import React, { useContext } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import ContinueButton from "../assets/components/ContinueButton";
import { UserContext } from "../contexts/userContext";
import globalStyles from "../assets/GlobalStyles";
import handleHTTPError from "../errorHandling";

function StylistDetailsComplete() {
	const navigation = useNavigation();
	const userContext = useContext(UserContext);

    const handleContinue = async () => {
        const req = {
            username: userContext.username,
            name: userContext.name,
            email: userContext.email,
            gender: userContext.gender,
            age: userContext.age,
            phoneNumber: userContext.phoneNumber,
            role: 'stylist'
        };
        console.log(req.body);
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API URL not defined");
                return;
            }
            const res = await axios.post(apiUrl + ':5050/stylist/', req);
            console.log('Stylist created: ', res.data);

            userContext.updateUserContext({
                ...userContext,
                role: 'stylist'
            });

            // Reset navigation and navigate to Main screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            console.error('Error with API: ', error);
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>You're all set, stylist!</Text>
            <View style={globalStyles.buttonContainer}>
                <ContinueButton onPress={() => handleContinue()} />
            </View>
        </View>
    );
}

export default StylistDetailsComplete;

const styles = {
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	buttonContainer: {
		marginTop: 20,
		width: "100%",
		alignItems: "center",
	},
};
