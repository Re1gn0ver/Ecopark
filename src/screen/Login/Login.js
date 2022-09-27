import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import CustomInput from '../../shared/components/CustomInput/CustomInput';

import {
  getHeight,
  getWidth,
} from '../../shared/components/Responsive/Responsive';
import {
  validateEmail,
  validatePassword,
} from '../../shared/components/Validate/Validate';

const EMAIL = 0;
const PASSWORD = 1;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [message, setMessage] = useState(['', '']);
  async function login() {
    var emailMessage = validateEmail(email);
    var passwordMessage = validatePassword(password);
    if (emailMessage === '' && passwordMessage === '') {
      setMessage([emailMessage, passwordMessage]);
      navigation.navigate('Waiting', { message: '' });
      let url = 'https://nmcnpm.herokuapp.com/api/v1/user/login';
      await axios
        .post(url, {
          password: password,
          email: email,
        })
        .then((response) => {
          if (response.data.status === 'fail') {
            const msg = response.data.msg;
            if (msg.includes('receptionist')) {
              navigation.goBack();
              navigation.replace('NonactiveAccount', 'Login');
            } else {
              navigation.goBack();
              setMessage(['', 'Password not match']);
            }
          } else {
            // login success -> store token and user info
            const data = response.data.data;
            const isBooking = response.data.check;
            const token = response.data.token;
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('info', JSON.stringify(data));
            AsyncStorage.setItem('isBooking', JSON.stringify(isBooking));
            navigation.goBack();
            navigation.replace('MainFlow', 'Landing');
          }
        })
        .catch((error) => {
          navigation.goBack();
        });
    } else {
      setMessage([emailMessage, passwordMessage]);
    }
  }
  return (
    <View style={{ padding: 16 }}>
      <View style={loginScreenStyle.welcomeContainer}>
        <Image
          style={loginScreenStyle.loginImage}
          source={require('../../shared/img/logo-ecopark.png')}
        />
      </View>
      <View style={{ marginTop: getHeight(118) }}>
        <View>
          <CustomInput
            icon={require('../../shared/img/email.png')}
            activeIcon={require('../../shared/img/a-email.png')}
            callBack={(value) => setEmail(value)}
            placeholder={'Email'}
          />
          <Text style={loginScreenStyle.messageText}>{message[EMAIL]}</Text>
        </View>
        <View style={{ marginTop: getHeight(10) }}>
          <CustomInput
            icon={require('../../shared/img/security.png')}
            activeIcon={require('../../shared/img/security-1.png')}
            callBack={(value) => setPasword(value)}
            placeholder={'Password'}
            isPassword={true}
          />
          <Text style={loginScreenStyle.messageText}>{message[PASSWORD]}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: getHeight(8),
          display: 'flex',
          flexDirection: 'row-reverse',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ForgetPassword');
          }}
        >
          <Text style={loginScreenStyle.registerText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <CustomButton
        children={[
          <Text key="textKey" style={loginScreenStyle.buttonText}>
            Sign In
          </Text>,
        ]}
        additionStyles={loginScreenStyle.button}
        onPress={login}
      />
      <View style={loginScreenStyle.footer}>
        <Text style={loginScreenStyle.footerText}>
          Already have an account?&nbsp;
        </Text>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            navigation.replace('Register', 'Login');
          }}
        >
          <Text style={loginScreenStyle.registerText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const loginScreenStyle = StyleSheet.create({
  messageText: {
    fontStyle: 'normal',
    fontSize: getHeight(14),
    textAlign: 'center',
    color: 'red',
    paddingLeft: getWidth(24),
  },
  buttonText: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(18),
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#06B4FA',
    height: getHeight(54),
    width: getWidth(343),
    borderRadius: 10,
    position: 'absolute',
    left: getWidth(16),
    top: getHeight(653),
  },
  welcomeContainer: {
    marginTop: getHeight(88),
  },
  registerText: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(16),
    textAlign: 'center',
    color: '#06B4FA',
  },
  footerText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: getHeight(16),
    textAlign: 'center',
    color: 'black',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: getHeight(728),
    left: '20%',
  },
  welcomeContent: {
    color: '#50555C',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: getHeight(14),
    marginTop: getHeight(8),
  },
  welcome: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(24),
    color: 'black',
  },
  loginImage: {
    width: 200,
    height: 'auto',
    aspectRatio: 1.5,
    resizeMode: 'contain',
    marginTop: 50,
    marginBottom: -50,
    alignSelf: 'center',
  },
});

export default LoginScreen;
