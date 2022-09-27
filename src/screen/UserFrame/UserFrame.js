import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import CustomInput from '../../shared/components/CustomInput/CustomInput';
import {
  getHeight,
  getWidth,
} from '../../shared/components/Responsive/Responsive';

const UserFrame = ({ navigation }) => {
  return (
    <KeyboardAvoidingView>
      <StatusBar hidden={true} />
      <View style={styles.form}>
        <Text style={styles.titleText}>Account activated</Text>
        <Text style={styles.contentText}>
          This feature will be deploy after this milestones.gt
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
              Sign out
            </Text>,
          ]}
          onPress={() => {
            navigation.push('Landing');
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

export default UserFrame;
