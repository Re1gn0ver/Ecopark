import axios from 'axios';
import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
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
  validatePhone,
  validateIdCode,
  validateName,
  validatePassword,
  validateResidentCode,
} from '../../shared/components/Validate/Validate';

const NAME = 0;
const EMAIL = 1;
const PHONE = 2;
const PASSWORD = 3;
const IDCODE = 4;
const RECODE = 5;

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [idcode, setIdcode] = useState('');
  const [recode, setRecode] = useState('');
  const [validateMessage, setMessage] = useState(['', '', '', '', '', '']);

  return (
    <KeyboardAvoidingView>
      <StatusBar hidden={true} />
      <View style={styles.form}>
        <View>
          <Text style={styles.titleText}>Create an account</Text>
        </View>
        <View style={{ marginTop: getHeight(21) }}>
          <CustomInput
            icon={require('../../shared/img/name.png')}
            activeIcon={require('../../shared/img/a-name.png')}
            callBack={(value) => setName(value)}
            placeholder={'Name'}
          />
          <Text style={styles.validateMessage}>{validateMessage[NAME]}</Text>
        </View>
        <View style={{ marginTop: 7 }}>
          <CustomInput
            icon={require('../../shared/img/email.png')}
            activeIcon={require('../../shared/img/a-email.png')}
            callBack={(value) => setEmail(value)}
            placeholder={'Email'}
          />
          <Text style={styles.validateMessage}>{validateMessage[EMAIL]}</Text>
        </View>
        <View style={{ marginTop: 7 }}>
          <CustomInput
            icon={require('../../shared/img/phone.png')}
            activeIcon={require('../../shared/img/a-phone.png')}
            callBack={(value) => setPhone(value)}
            placeholder={'Phone'}
          />
          <Text style={styles.validateMessage}>{validateMessage[PHONE]}</Text>
        </View>
        <View style={{ marginTop: 7 }}>
          <CustomInput
            icon={require('../../shared/img/security.png')}
            activeIcon={require('../../shared/img/security-1.png')}
            callBack={(value) => setPassword(value)}
            placeholder={'Password'}
            isPassword={true}
          />
          <Text style={styles.validateMessage}>
            {validateMessage[PASSWORD]}
          </Text>
        </View>
        <View style={{ marginTop: 7 }}>
          <CustomInput
            icon={require('../../shared/img/iden-code.png')}
            activeIcon={require('../../shared/img/a-iden-code.png')}
            callBack={(value) => setIdcode(value)}
            placeholder={'Identity Code'}
          />
          <Text style={styles.validateMessage}>{validateMessage[IDCODE]}</Text>
        </View>
        <View style={{ marginTop: 7 }}>
          <CustomInput
            icon={require('../../shared/img/recode.png')}
            activeIcon={require('../../shared/img/a-recode.png')}
            callBack={(value) => setRecode(value)}
            placeholder={'Resident ID'}
          />
          <Text style={styles.validateMessage}>{validateMessage[RECODE]}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>By signing up you agree to our </Text>
          <TouchableOpacity activeOpacity={0.3} onPress={() => {}}>
            <Text style={styles.registerText}>
              Term of Use and Privacy Policy
            </Text>
          </TouchableOpacity>
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
              Join Now
            </Text>,
          ]}
          additionStyles={{
            backgroundColor: '#06B4FA',
            height: 54,
            borderRadius: 10,
            marginTop: getHeight(17),
          }}
          onPress={async () => {
            var nameMessage = validateName(name);
            var emailMessage = validateEmail(email);
            var phoneMessage = validatePhone(phone);
            var passwordMessage = validatePassword(password);
            var idcodeMessage = validateIdCode(idcode);
            var recodeMessage = validateResidentCode(recode);
            if (
              nameMessage === '' &&
              emailMessage === '' &&
              phoneMessage === '' &&
              passwordMessage === '' &&
              idcodeMessage === '' &&
              recodeMessage === ''
            ) {
              navigation.navigate('Waiting', { message: '' });
              var url = 'https://nmcnpm.herokuapp.com/api/v1/user/register';
              await axios
                .post(url, {
                  identifyNumber: idcode,
                  password: password,
                  email: email,
                  phoneNumber: phone,
                  name: name,
                  residentID: recode,
                  address: 'No address',
                })
                .then((response) => {
                  if (response.data.status == 'fail') {
                    const msg = response.data.msg;
                    if (msg.includes('User')) {
                      emailMessage = 'Duplicated email, try to use another';
                    } else {
                      if (msg.includes('Telephone')) {
                        phoneMessage = msg;
                      } else {
                        if (msg.includes('Indentity')) {
                          idcodeMessage = 'Identity number is existed';
                        }
                      }
                    }
                    setMessage([
                      nameMessage,
                      emailMessage,
                      phoneMessage,
                      passwordMessage,
                      idcodeMessage,
                      recodeMessage,
                    ]);
                    navigation.goBack();
                  } else {
                    navigation.goBack();
                    navigation.navigate('NonactiveAccount');
                    setMessage([
                      nameMessage,
                      emailMessage,
                      phoneMessage,
                      passwordMessage,
                      idcodeMessage,
                      recodeMessage,
                    ]);
                  }
                })
                .catch((error) => {});
            } else {
              setMessage([
                nameMessage,
                emailMessage,
                phoneMessage,
                passwordMessage,
                idcodeMessage,
                recodeMessage,
              ]);
            }
          }}
        />
        <View style={styles.footer}>
          <Text style={{ ...styles.footerText, fontSize: getHeight(16) }}>
            Already have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
              navigation.replace('Login', 'Register');
            }}
          >
            <Text style={{ ...styles.registerText, fontSize: getHeight(16) }}>
              {' '}
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  registerText: {
    fontStyle: 'normal',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    color: '#06B4FA',
    marginTop: 5,
    fontSize: 13,
  },
  footerText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'black',
    marginTop: 5,
    fontSize: 13,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getHeight(8),
  },
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
    textAlign: 'center',
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

export default Register;
