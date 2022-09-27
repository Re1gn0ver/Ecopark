import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
const LoadingScreen = () => {
  return (
    <View style={LoadingScreenStyles.backgroundCenter}>
      <Image
        style={LoadingScreenStyles.ecoIcon}
        source={require('../../shared/img/ecopark-icon.png')}
      />
      <ActivityIndicator size={40} color={'white'} />
    </View>
  );
};

const LoadingScreenStyles = StyleSheet.create({
  backgroundCenter: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06B4FA',
  },
  ecoIcon: {
    width: 200,
    height: 'auto',
    aspectRatio: 1.5,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default LoadingScreen;
