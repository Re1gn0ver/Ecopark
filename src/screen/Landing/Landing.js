import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import {
  getHeight,
  getWidth,
} from '../../shared/components/Responsive/Responsive';
const Landing = ({ navigation }) => {
  return (
    <View style={landingStyle.mainScreen}>
      <ImageBackground
        style={landingStyle.imageBackground}
        source={require('../../shared/img/landing-image.jpg')}
      />
      <LinearGradient
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
        style={landingStyle.gradientCover}
      ></LinearGradient>
      <View style={landingStyle.content}>
        <Text style={landingStyle.titleText}>Let’s Join with Us</Text>
        <Text style={landingStyle.contentText}>
          Find and book bike anywhere, anytime in Ecopark City
        </Text>
      </View>
      <CustomButton
        onPress={() => {
          navigation.navigate('Register');
        }}
        children={[
          <Image
            key="landing-register-image"
            source={require('../../shared/img/landing-icon.png')}
            style={landingStyle.iconButton}
          />,
          <Text key="landing-register-text" style={landingStyle.buttonText}>
            Register
          </Text>,
        ]}
        additionStyles={landingStyle.button}
      />
      <View style={landingStyle.footer}>
        <Text style={landingStyle.footerText}>Already have an account?</Text>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <Text style={landingStyle.signInText}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const landingStyle = StyleSheet.create({
  signInText: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(16),
    textAlign: 'center',
    color: '#8DC63F',
  },
  footerText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: getHeight(16),
    textAlign: 'center',
    color: 'white',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    top: getHeight(670),
  },
  contentText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: getHeight(16),
    textAlign: 'center',
    color: 'white',
  },
  titleText: {
    marginTop: getHeight(16),
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(20),
    textAlign: 'center',
    color: 'white',
  },
  content: {
    position: 'absolute',
    top: getHeight(445),
    width: getWidth(287),
  },
  gradientCover: {
    height: '100%',
    width: '100%',
    zIndex: 0,
    position: 'absolute',
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    zIndex: 0,
    position: 'absolute',
    zIndex: 0,
  },
  iconButton: {
    height: getHeight(45),
    width: getWidth(48),
    resizeMode: 'contain',
  },
  mainScreen: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  button: {
    height: getHeight(54),
    backgroundColor: 'white',
    top: getHeight(659),
    borderRadius: 30,
    width: getWidth(343),
  },
  buttonText: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    color: '#8DC63F',
    fontSize: 18,
  },
});
export default Landing;
