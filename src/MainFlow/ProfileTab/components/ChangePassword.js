import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationHelpersContext } from '@react-navigation/core';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import CustomButton from '../../../shared/components/CustomButton/CustomButton';
import CustomInput from '../../../shared/components/CustomInput/CustomInput';
import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';
import { validatePassword } from '../../../shared/components/Validate/Validate';

const PASSWORD = 0;
const CONFIRM = 1;
const OLDPASSWORD = 2;

const ChangePassword = ({ navigation }) => {
  const [password, setPassowrd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [validateMessage, setMessage] = useState(['', '', '']);
  async function ChangePassword() {
    const token = await AsyncStorage.getItem('token');
    const userInfo = JSON.parse(await AsyncStorage.getItem('info'));
    navigation.navigate('Waiting', {
      message: '',
    });
    axios({
      method: 'POST',
      url:
        'https://nmcnpm.herokuapp.com/api/v1/user/changepass/' + userInfo._id,
      data: {
        oldPassword: oldPassword,
        newPassword: password,
      },
      Headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then((response) => {
      if (response.data.status === 'fail') {
        navigation.goBack();
        setMessage(['', '', 'Old password not match']);
      } else {
        navigation.goBack();
        navigation.navigate('Waiting', {
          message: 'changePassword',
        });
      }
    });
  }
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
        <View style={{ marginTop: getHeight(10) }}>
          <CustomInput
            icon={require('../../../shared/img/security.png')}
            activeIcon={require('../../../shared/img/security-1.png')}
            callBack={(value) => setOldPassword(value)}
            placeholder={'Old password'}
            autoFocus={true}
            isPassword={true}
          />
          <Text style={styles.validateMessage}>
            {validateMessage[OLDPASSWORD]}
          </Text>
        </View>
        <View style={{ marginTop: getHeight(10) }}>
          <CustomInput
            icon={require('../../../shared/img/security.png')}
            activeIcon={require('../../../shared/img/security-1.png')}
            callBack={(value) => setPassowrd(value)}
            placeholder={'New password'}
            isPassword={true}
            autoFocus={false}
          />
          <Text style={styles.validateMessage}>
            {validateMessage[PASSWORD]}
          </Text>
        </View>
        <View style={{ marginTop: getHeight(10) }}>
          <CustomInput
            icon={require('../../../shared/img/security.png')}
            activeIcon={require('../../../shared/img/security-1.png')}
            callBack={(value) => setConfirm(value)}
            placeholder={'Confirm new password'}
            autoFocus={false}
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
              ChangePassword
            </Text>,
          ]}
          additionStyles={{
            backgroundColor: '#06B4FA',
            height: 54,
            borderRadius: 10,
            marginTop: getHeight(35),
          }}
          onPress={() => {
            const oldMessage = validatePassword(oldPassword);
            const passwordMessage = validatePassword(password);
            const confirmMessage = validatePassword(confirm);
            if (
              passwordMessage === '' &&
              confirmMessage === '' &&
              oldMessage === ''
            ) {
              if (password !== confirm) {
                setMessage(['', "Confirm password doesn't match", '']);
              } else {
                if (oldPassword === password) {
                  setMessage([
                    'New password need to be diffirent',
                    'New password need to be diffirent',
                    '',
                  ]);
                } else {
                  setMessage(['', '', '']);
                  ChangePassword();
                }
              }
            } else {
              setMessage([passwordMessage, confirmMessage, oldMessage]);
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

export default ChangePassword;
