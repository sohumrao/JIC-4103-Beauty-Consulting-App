import * as React from "react";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserContext, UserContextProvider } from "./contexts/userContext";

import LandingPage from "./Pages/LandingPage";
import ClientDetails from "./Pages/ClientDetails";
import ClientDetails2 from "./Pages/ClientDetails2";
import ClientDetails3 from "./Pages/ClientDetails3";
import ClientDetailsComplete from "./Pages/ClientDetailsComplete";
import ProfilePage from "./Pages/ProfilePage";
import SignInPage from "./Pages/SignInPage";
import CreateAccountPage from "./Pages/CreateAccountPage";
import ProfileView from "./Pages/ProfileView";
import ForgotPasswordPage from "./Pages/ResetPassword/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPassword/ResetPasswordPage";
import StylistDetails from "./Pages/StylistDetails";
import StylistDetails2 from "./Pages/StylistDetails2";
import StylistDetails3 from "./Pages/StylistDetails3";
import StylistDetailsComplete from "./Pages/StylistDetailsComplete";
import BusinessInfoPage from "./Pages/BusinessInfoPage";

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
  const { role } = useContext(UserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {role === "client" ? (
        <Tab.Screen name="ProfileView" component={ProfileView} />
      ) : (
        <Tab.Screen name="BusinessInfoPage" component={BusinessInfoPage} />
      )}
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Sign In" component={SignInPage} />
          <Stack.Screen name="Create Account" component={CreateAccountPage} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen
            name="Client Details Stack"
            component={ClientDetailsStack}
          />
          <Stack.Screen
            name="Stylist Details Stack"
            component={StylistDetailsStack}
          />
          <Stack.Screen name="Forgot Password" component={ForgotPasswordPage} />
          <Stack.Screen name="Reset Password" component={ResetPasswordPage} />

          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;
