import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import BikeCard from './BikeCard';
const ShowBikeInfo = ({ route, navigation }) => {
  const { bikeInfo, pickClick } = route.params;
  return (
    <View style={styles.backgroundCenter}>
      <BikeCard
        bikeInfo={bikeInfo}
        backClick={() => {
          navigation.goBack();
        }}
        pickClick={pickClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundCenter: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default ShowBikeInfo;
