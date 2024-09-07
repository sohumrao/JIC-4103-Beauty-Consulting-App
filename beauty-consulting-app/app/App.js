import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './Pages/LandingPage';
import ClientDetails from './Pages/ClientDetails';
import ClientDetails2 from './Pages/ClientDetails2';
import ClientDetails3 from './Pages/ClientDetails3';
import ClientDetailsComplete from './Pages/ClientDetailsComplete';
import ProfilePage from './Pages/ProfilePage';
import SignInPage from './Pages/SignInPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import ProfileView from './Pages/ProfileView';
import ForgotPasswordPage  from './Pages/ForgotPasswordPage';

const Stack = createNativeStackNavigator();

const UserContext = React.createContext({
  username: 'not signed in',
  name: 'No Name', 
  age: 0,
  gender: 'male',
  phoneNumber: '0000000000',
  email: 'email@emailsite.com',
  hairDetails: {Natural: false,
        Relaxed: false,
        Straight: false,
        Wavy: false,
        Curly: false,
        DeepWave: false,
        LooseCurl: false,
        TightlyCoiled: false,
        Fine: false,
        Medium: false,
        Thick: false},
  allergies: '',
  concerns: '', 
  updateUserContext: () => {}
});

export { UserContext };


function App() {

  const updateUserContext = (userContextObject) => {
    setUserContext(userContextObject);
  }

  const [userContext, setUserContext] = React.useState({
  name: 'No Name', 
  age: 0,
  gender: 'male',
  phoneNumber: '0000000000',
  email: 'email@emailsite.com',
  hairDetails: {Natural: false,
        Relaxed: false,
        Straight: false,
        Wavy: false,
        Curly: false,
        DeepWave: false,
        LooseCurl: false,
        TightlyCoiled: false,
        Fine: false,
        Medium: false,
        Thick: false},
  allergies: '',
  concerns: '', 
  updateUserContext
});

  return (
    
    <UserContext.Provider value={userContext}>
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
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;