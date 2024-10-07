import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext, UserContextProvider } from "./contexts/userContext";

import LandingPage from './Pages/LandingPage';
import ClientDetails from './Pages/ClientDetails';
import ClientDetails2 from './Pages/ClientDetails2';
import ClientDetails3 from './Pages/ClientDetails3';
import ClientDetailsComplete from './Pages/ClientDetailsComplete';
import ProfilePage from './Pages/ProfilePage';
import SignInPage from './Pages/SignInPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import ProfileView from './Pages/ProfileView';
import ForgotPasswordPage from './Pages/ResetPassword/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPassword/ResetPasswordPage';
import StylistDetails from './Pages/StylistDetails';
import StylistDetails2 from './Pages/StylistDetails2';
import StylistDetailsComplete from './Pages/StylistDetailsComplete';
import BusinessInfoPage from './Pages/BusinessInfoPage';

const Stack = createNativeStackNavigator();

function App() {
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
