import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../assets/GlobalStyles';

import ContinueButton from '../assets/components/ContinueButton';
import LandingPageImg from '../assets/images/LandingPageImg.png';
import SignupBackground from '../assets/components/SignupBackground';

function LandingPage() {
  const navigation = useNavigation();

  return (
    <SignupBackground>
      <View style={globalStyles.box}>
        <View style={globalStyles.imageContainer}>
          <Image 
            source={LandingPageImg} 
            style={globalStyles.circleImage}
          />
        </View>
        <Text style={globalStyles.title}>Sign up as a client</Text>
        <View style={globalStyles.buttonContainer}>
          <ContinueButton onPress={() => navigation.navigate('ClientDetails')} />
        </View>
      </View>
    </SignupBackground>
  );
}

export default LandingPage;
