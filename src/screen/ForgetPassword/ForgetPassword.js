import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import CustomInput from '../../shared/components/CustomInput/CustomInput';
import {
  getHeight,
  getWidth,
} from '../../shared/components/Responsive/Responsive';
import { validateEmail } from '../../shared/components/Validate/Validate';

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  return (
    <KeyboardAvoidingView>
      <StatusBar hidden={true} />
      <View style={styles.form}>
        <View style={{ marginTop: getHeight(50) }}>
          <Text style={styles.titleText}>Forgot your password?</Text>
          <Text style={styles.contentText}>
            Confirm your email and we'll send the instructions
          </Text>
        </View>
        <View style={{ marginTop: getHeight(50) }}>
          <CustomInput
            icon={require('../../shared/img/email.png')}
            activeIcon={require('../../shared/img/a-email.png')}
            callBack={(value) => setEmail(value)}
            placeholder={'Email address'}
            autoFocus={true}
          />
          <Text style={styles.validateMessage}>{emailMessage} </Text>
        </View>
        <CustomButton
          children={[
            <Text
              key="register-text"
              style={{
                ...styles.contentText,
                fontFamily: 'Quicksand-Bold',
                color: 'white',
              }}
            >
              Send Instructions
            </Text>,
          ]}
          additionStyles={{
            backgroundColor: '#06B4FA',
            height: 54,
            borderRadius: 10,
            marginTop: getHeight(50),
          }}
          onPress={async () => {
            var emailMessage = validateEmail(email);
            navigation.navigate('Waiting', { message: '' });
            if (emailMessage === '') {
              var url = 'https://nmcnpm.herokuapp.com/api/v1/user/forgetpass';
              await axios
                .post(url, {
                  email: email,
                })
                .then((response) => {
                  if (response.data.status === 'fail') {
                    const msg = response.data.msg;
                    emailMessage = msg;
                    navigation.goBack();
                    setEmailMessage(emailMessage);
                  } else {
                    navigation.goBack();
                    navigation.navigate('Waiting', {
                      message: 'resetPassword',
                    });
                    setEmailMessage(emailMessage);
                  }
                })
                .catch((error) => {});
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  validateMessage: {
    fontStyle: 'normal',
    fontSize: getHeight(16),
    color: 'red',
    paddingLeft: getWidth(24),
  },
  titleText: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    fontSize: getHeight(24),
    color: 'black',
  },
  contentText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: getHeight(18),
    color: 'black',
  },
  form: {
    top: getHeight(78),
    paddingLeft: getHeight(16),
    paddingRight: getHeight(16),
  },
});

export default ForgetPassword;
