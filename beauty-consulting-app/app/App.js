import * as React from "react";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	LandingPage,
	ClientDetails,
	ClientDetails2,
	ClientDetails3,
	ClientDetailsComplete,
	SignInPage,
	CreateAccountPage,
	ProfileView,
	ForgotPasswordPage,
	ResetPasswordPage,
	StylistDetails,
	StylistDetails2,
	StylistDetails3,
	StylistDetailsComplete,
	BusinessInfoPage,
	AppointmentsPage,
	Directory,
	ConversationPage,
	MessagePage,
} from "./Pages";
import { UserContext, UserContextProvider } from "./contexts/userContext";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClientDetailsStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: true, headerTitle: "" }}>
			<Stack.Screen name="ClientDetails" component={ClientDetails} />
			<Stack.Screen name="ClientDetails2" component={ClientDetails2} />
			<Stack.Screen name="ClientDetails3" component={ClientDetails3} />
			<Stack.Screen
				name="ClientDetailsComplete"
				component={ClientDetailsComplete}
			/>
		</Stack.Navigator>
	);
}

function StylistDetailsStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: true, headerTitle: "" }}>
			<Stack.Screen name="StylistDetails" component={StylistDetails} />
			<Stack.Screen name="StylistDetails2" component={StylistDetails2} />
			<Stack.Screen name="StylistDetails3" component={StylistDetails3} />
			<Stack.Screen
				name="StylistDetailsComplete"
				component={StylistDetailsComplete}
			/>
		</Stack.Navigator>
	);
}

function MainTabNavigator() {
	const { username, role, updateUserContext } = useContext(UserContext);
	const navigation = useNavigation();
	const LogoutComponent = () => null;
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			{role === "client" ? (
				// Navigate to ProfileView for both clients and stylists
				<Tab.Screen name="ProfileView" component={ProfileView} />
			) : (
				<Tab.Screen
					name="BusinessInfoPage"
					component={BusinessInfoPage}
					// FIXME: hack to pass username as a prop
					initialParams={{ username }}
				/>
			)}
			{role === "client" && (
				<Tab.Screen name="Directory" component={Directory} />
			)}
			<Tab.Screen name="Appointments" component={AppointmentsPage} />
			<Tab.Screen name="Messages" component={ConversationPage} />
			<Tab.Screen
				name="Logout"
				component={LogoutComponent}
				listeners={{
					tabPress: (e) => {
						// Prevent default action
						e.preventDefault();
						updateUserContext(null);
						navigation.reset({
							index: 0,
							routes: [{ name: "Sign In" }],
						});
					},
				}}
			/>
		</Tab.Navigator>
	);
}

function App() {
	return (
		<UserContextProvider>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Sign In" component={SignInPage} />
					<Stack.Screen
						name="Create Account"
						component={CreateAccountPage}
					/>
					<Stack.Screen name="LandingPage" component={LandingPage} />
					<Stack.Screen
						name="Client Details Stack"
						component={ClientDetailsStack}
					/>
					<Stack.Screen
						name="Stylist Details Stack"
						component={StylistDetailsStack}
					/>
					<Stack.Screen
						name="Forgot Password"
						component={ForgotPasswordPage}
					/>
					<Stack.Screen
						name="Reset Password"
						component={ResetPasswordPage}
					/>

					<Stack.Screen
						name="Main"
						component={MainTabNavigator}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="BusinessInfoPage"
						component={BusinessInfoPage}
						screenOptions={{
							headerShown: true,
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</UserContextProvider>
	);
}

export default App;
