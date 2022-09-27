import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const CustomButton = ({
  children = [
    <Text
      key="1"
      style={{
        color: 'white',
        fontWeight: '700',
      }}
    >
      Hello World
    </Text>,
  ],
  additionStyles = {},
  onPress = () => console.log('Click'),
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      style={{ ...defautStyle.button, ...additionStyles }}
      onPress={() => onPress()}
    >
      {children.map((element) => {
        return element;
      })}
    </TouchableOpacity>
  );
};

const defautStyle = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
});

export default CustomButton;
