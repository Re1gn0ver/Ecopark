import React, { Component, useState, version } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { theme } from '../../../core/theme';
import { getHeight, getWidth } from '../Responsive/Responsive';
const CustomInput = ({
  autoFocus = false,
  placeholder = 'Text Input',
  inputStyle,
  inputStyleEdit,
  imageStyle,
  containerStyleOn,
  containerStyleOff,
  icon = require('../../img/default.png'),
  activeIcon = require('../../img/e-default.png'),
  isPassword = false,
  callBack = () => console.log('Hello World'),
}) => {
  const [isEdit, setEdit] = useState(false);
  const [isShowPassword, setShowPassword] = useState(isPassword);
  const [value, setValue] = useState('');

  return (
    <View
      style={
        isEdit
          ? (containerStyleOn, DefaultStyle.containerStyleOn)
          : (containerStyleOff, DefaultStyle.containerStyleOff)
      }
    >
      {/* <Image
        style={(imageStyle, DefaultStyle.imageStyle)}
        source={isEdit ? activeIcon : icon}
      /> */}
      <TextInput
        autoFocus={autoFocus}
        secureTextEntry={isShowPassword}
        value={value}
        onChange={(value) => {
          callBack(value.nativeEvent.text);
          setValue(value.nativeEvent.text);
        }}
        style={
          isEdit
            ? (inputStyleEdit, DefaultStyle.inputStyleEdit)
            : (inputStyle, DefaultStyle.inputStyle)
        }
        placeholder={placeholder}
        onFocus={() => {
          setEdit(true);
        }}
        onBlur={() => {
          setEdit(false);
        }}
      />
      {isPassword && (
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => {
            setShowPassword(!isShowPassword);
          }}
        >
          {isShowPassword ? (
            <Image
              style={{
                height: getHeight(25),
                aspectRatio: 1,
                resizeMode: 'contain',
              }}
              source={require('../../img/visible.png')}
            />
          ) : (
            <Image
              style={{
                aspectRatio: 1,
                height: getHeight(25),
                resizeMode: 'contain',
              }}
              source={require('../../img/u-visible.png')}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
const DefaultStyle = StyleSheet.create({
  inputStyleEdit: {
    flex: 1,
    paddingLeft: 16,
    fontSize: getHeight(16),
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#06B4FA',
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 16,
    fontSize: getHeight(16),
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: '#ADB3BC',
  },
  imageStyle: {
    width: getWidth(25),
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  containerStyleOn: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#06B4FA',
    backgroundColor: 'white',
    paddingRight: 24,
    paddingLeft: 24,
    height: getHeight(54),
    borderRadius: 10,
  },
  containerStyleOff: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    height: getHeight(54),
    borderRadius: 10,
    paddingLeft: 24,
    paddingRight: 24,
  },
});

export default CustomInput;
