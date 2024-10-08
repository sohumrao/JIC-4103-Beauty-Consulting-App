import * as React from 'react';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LandingPage,
  ClientDetails,
  ClientDetails2,
  ClientDetails3,
  ClientDetailsComplete,
  ProfilePage,
  SignInPage,
  CreateAccountPage,
  ProfileView,
  ForgotPasswordPage,
  ResetPasswordPage,
  StylistDetails,
  StylistDetails2,
  StylistDetailsComplete,
  BusinessInfoPage,
} from './Pages';
import { UserContext, UserContextProvider } from "./contexts/userContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClientDetailsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTitle: '' }}>
      <Stack.Screen name="ClientDetails" component={ClientDetails} />
      <Stack.Screen name="ClientDetails2" component={ClientDetails2} />
      <Stack.Screen name="ClientDetails3" component={ClientDetails3} />
      <Stack.Screen name="ClientDetailsComplete" component={ClientDetailsComplete} />
    </Stack.Navigator>
  );
}

function StylistDetailsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTitle: '' }}>
      <Stack.Screen name="StylistDetails" component={StylistDetails} />
      <Stack.Screen name="StylistDetails2" component={StylistDetails2} />
      <Stack.Screen name="StylistDetailsComplete" component={StylistDetailsComplete} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  const { role } = useContext(UserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {role === 'client' ? (
        <Tab.Screen name="ProfileView" component={ProfileView} />
      ) : (
        <Tab.Screen name="BusinessInfoPage" component={BusinessInfoPage} />
      )}
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sign In" component={SignInPage}/>
          <Stack.Screen name="Create Account" component={CreateAccountPage}/>
          <Stack.Screen name="LandingPage" component={LandingPage} options={{ title: 'Welcome' }} />
          <Stack.Screen name="ClientDetails" component={ClientDetails} />
          <Stack.Screen name="ClientDetails2" component={ClientDetails2} />
          <Stack.Screen name="ClientDetails3" component={ClientDetails3} />
          <Stack.Screen name="ClientDetailsComplete" component={ClientDetailsComplete} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="ProfileView" component={ProfileView} />
          <Stack.Screen name="Forgot Password" component={ForgotPasswordPage}/>
          <Stack.Screen name="Reset Password" component={ResetPasswordPage}/>
          <Stack.Screen name="Stylist Details" component={StylistDetails}/>
          <Stack.Screen name="StylistDetails2" component={StylistDetails2}/>
          <Stack.Screen name="StylistDetails3" component={StylistDetailsComplete}/>
          <Stack.Screen name="BusinessInfoPage" component={BusinessInfoPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;
