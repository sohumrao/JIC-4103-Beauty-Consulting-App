import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

import ClientDetails from './ClientDetails';
import ContinueButton from '../assets/components/ContinueButton';
import LandingPageImg from '../assets/images/LandingPageImg.png';
import SignupBackground from '../assets/components/SignupBackground';


function LandingPage() {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
      marginBottom: -50,
    },
    circleImage: {
      width: 350,
      height: 350,
      borderRadius: 175,
      borderWidth: 3,
      borderColor: 'black',
      overflow: 'hidden',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: -48, 
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
  });

  return (
    <SignupBackground>
      <View style={styles.imageContainer}>
        <Image 
          source={LandingPageImg} 
          style={styles.circleImage}
        />
      </View>
      <Text style={styles.title}>Sign up as a client</Text>
      <View style={styles.buttonContainer}>
        <ContinueButton onPress={() => navigation.navigate('ClientDetails')} />
      </View>
    </SignupBackground>
  );
}

export default LandingPage;