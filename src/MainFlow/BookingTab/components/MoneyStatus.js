import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';

const MoneyStatus = ({ money, margin }) => {
  function currencyFormat(num) {
    if (num == 0) return '0 VND';
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
    // return '100000 VND';
  }
  return (
    <ImageBackground
      style={{
        margin: margin,
        paddingVertical: 20,
        paddingHorizontal: 15,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        width: getWidth(351),
        height: getHeight(180),
      }}
      imageStyle={{ borderRadius: 10 }}
      source={{
        uri: 'https://wallpaperaccess.com/full/1429818.jpg',
      }}
      resizeMode="cover"
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{
            fontFamily: 'Quicksand-Medium',
            fontWeight: 'normal',
            fontSize: 24,
            color: '#fff',
          }}
        >
          Wallet
        </Text>
        <Image
          style={{ width: 70, height: 45 }}
          source={require('../../../shared/img/ecopark-icon.png')}
        />
      </View>
      <Text
        style={{
          fontFamily: 'Quicksand-Bold',
          marginTop: 80,
          marginLeft: 210,
          fontSize: 24,
          color: '#fff',
        }}
      >
        {currencyFormat(money)}
      </Text>
    </ImageBackground>
  );
};

export default MoneyStatus;
