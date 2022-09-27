import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import { getWidth } from '../../shared/components/Responsive/Responsive';

const NonactiveAccountScreen = ({ navigation }) => {
  return (
    <KeyboardAvoidingView>
      <StatusBar hidden={true} />
      <View style={styles.form}>
        <Text style={styles.titleText}>Register Successfully</Text>
        <Text style={styles.contentText}>
          Please go to the nearest station for assistance
        </Text>
        <CustomButton
          additionStyles={{
            backgroundColor: '#06B4FA',
            width: getWidth(343),
            height: 54,
            borderRadius: 10,
            position: 'absolute',
            bottom: 20,
          }}
          children={[
            <Text key="signOut-text" style={styles.buttonText}>
              Go back
            </Text>,
          ]}
          onPress={() => {
            navigation.push('Login');
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: 'white',
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: 'black',
  },
  contentText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black',
  },
  form: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NonactiveAccountScreen;
