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
import {
  validateEmail,
  validatePassword,
} from '../../shared/components/Validate/Validate';

const PASSWORD = 0;
const CONFIRM = 1;

const ResetPassword = () => {
  const [password, setPassowrd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [validateMessage, setMessage] = useState(['', '']);

  return (
    <KeyboardAvoidingView>
      <StatusBar hidden={true} />
      <View style={styles.form}>
        <View>
          <Text style={styles.titleText}>New password,</Text>
          <Text style={styles.contentText}>
            Now, you can create new password and confirm it below
          </Text>
        </View>
        <View style={{ marginTop: getHeight(70) }}>
          <CustomInput
            icon={require('../../shared/img/security.png')}
            activeIcon={require('../../shared/img/security-1.png')}
            callBack={(value) => setPassowrd(value)}
            placeholder={'New password'}
            isPassword={true}
            autoFocus={true}
          />
          <Text style={styles.validateMessage}>
            {validateMessage[PASSWORD]}
          </Text>
        </View>
        <View style={{ marginTop: getHeight(10) }}>
          <CustomInput
            icon={require('../../shared/img/security.png')}
            activeIcon={require('../../shared/img/security-1.png')}
            callBack={(value) => setConfirm(value)}
            placeholder={'Confirm new password'}
            autoFocus={true}
            isPassword={true}
          />
          <Text style={styles.validateMessage}>{validateMessage[CONFIRM]}</Text>
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
              Confirm new password
            </Text>,
          ]}
          additionStyles={{
            backgroundColor: '#06B4FA',
            height: 54,
            borderRadius: 10,
            marginTop: getHeight(60),
          }}
          onPress={() => {
            const passwordMessage = validatePassword(password);
            const confirmMessage = validatePassword(confirm);
            if (passwordMessage === '' && confirmMessage === '') {
              if (password !== confirm) {
                setMessage(['', "Confirm password doesn't match"]);
              }
            } else {
              setMessage([passwordMessage, confirmMessage]);
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
    fontSize: getHeight(16),
    color: 'black',
  },
  form: {
    top: getHeight(78),
    paddingLeft: getHeight(16),
    paddingRight: getHeight(16),
  },
});

export default ResetPassword;
