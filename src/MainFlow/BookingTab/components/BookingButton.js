import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';

const BookingButton = ({ marginTop, onPress }) => {
  return (
    <View
      style={{
        marginTop: marginTop,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        width: getWidth(351),
        height: getHeight(150),
        borderRadius: 10,
        paddingHorizontal: 21,
        paddingVertical: 25,
      }}
    >
      <TouchableOpacity
        style={{
          marginTop: 8,
          height: getHeight(54),
          width: getWidth(302),
          backgroundColor: '#06B4FA',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.3}
        onPress={onPress}
      >
        <Text
          style={{
            fontFamily: 'Quicksand-Bold',
            fontSize: 24,
            color: 'white',
          }}
        >
          Book a bike
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingButton;
