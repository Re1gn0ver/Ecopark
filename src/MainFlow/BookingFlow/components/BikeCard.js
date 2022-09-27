import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  TextInputBase,
  View,
  Text,
  Button,
  Image,
  TouchableOpacityBase,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';

const BikeCard = ({ bikeInfo, backClick, pickClick }) => {
  const [selected, setSelected] = useState(false);
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: bikeInfo.image }} style={styles.bikeImage} />
      <Text
        style={{
          fontSize: 26,
          fontFamily: 'Quicksand-Bold',
        }}
      >
        {bikeInfo.name}
      </Text>
      <Text
        style={{
          color: '#06B4FA',
          fontFamily: 'Quicksand-Bold',
          fontSize: 28,
        }}
      >
        {bikeInfo.cost} • 1 hour
      </Text>
      <Text style={styles.title}>Product Details</Text>
      <Text style={styles.description}>{bikeInfo.description}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity style={styles.backButton} onPress={backClick}>
          <Image
            style={styles.backImage}
            source={require('../../../shared/img/back-button.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickButton} onPress={pickClick}>
          <Text
            style={{
              fontFamily: 'Quicksand-Bold',
              color: 'white',
              fontSize: 20,
            }}
          >
            Select bike
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingTop: 20,
    paddingHorizontal: 12,
    width: getHeight(366),
    borderRadius: 10,
    backgroundColor: 'white',
  },
  bikeImage: {
    height: getHeight(286),
    width: '100%',
    borderRadius: 15,
    backgroundColor: 'blue',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Quicksand-Bold',
  },
  price: {
    color: '#06B4FA',
    fontFamily: 'Quicksand-Bold',
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: 'black',
  },
  description: {
    fontSize: 17,
    fontWeight: 'normal',
    fontFamily: 'Quicksand-Medium',
    color: 'black',
    paddingBottom: 20,
  },
  backImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  backButton: {
    height: 60,
    width: 60,
    borderColor: '#e0dede',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickButton: {
    marginLeft: 10,
    marginBottom: 15,
    backgroundColor: '#06B4FA',
    height: 60,
    width: 280,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BikeCard;
