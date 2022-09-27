import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
const Waiting = ({ navigation, route }) => {
  switch (route.params.message) {
    case 'cancleSuccessful':
      return (
        <Dialog
          text={'Your bill has been canceled'}
          status={true}
          navigation={navigation}
        />
      );
    case 'resetPassword':
      return (
        <Dialog
          text={'Please check your email to get new password'}
          status={true}
          navigation={navigation}
        />
      );
    case 'timeout':
      return (
        <Dialog
          text={'Waiting time is timeout, you need to use your bike'}
          status={false}
          navigation={navigation}
        />
      );
    case 'successfulBooking':
      return (
        <Dialog
          text={"Time's begined, booking successful"}
          status={true}
          navigation={navigation}
        />
      );
    case 'successfulFinishing':
      return (
        <Dialog
          text={'Thanks to use our service'}
          status={true}
          navigation={navigation}
        />
      );

    case 'stationReject':
      return (
        <Dialog
          text={'Staff reject your bill'}
          status={false}
          navigation={navigation}
        />
      );
    case 'stationUnfoundBike':
      return (
        <Dialog
          text={"Your bike doesn't belong to this station"}
          status={false}
          navigation={navigation}
        />
      );
    case 'changePassword':
      return (
        <Dialog
          text={'Change password susscessful'}
          status={true}
          navigation={navigation}
        />
      );
    case 'duplicateBooking':
      return (
        <Dialog
          text={'You have booked \nanother bike'}
          status={false}
          navigation={navigation}
        />
      );
    default:
      return (
        <View style={styles.backgroundCenter}>
          <ActivityIndicator size={50} color={'white'} />
        </View>
      );
  }
};

export default Waiting;

const Dialog = ({ text, status, navigation }) => {
  return (
    <View style={styles.backgroundCenter}>
      <View
        style={{
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={
            status
              ? require('../../shared/img/done.png')
              : require('../../shared/img/cross.png')
          }
          style={{
            height: 100,
            width: 100,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            color: 'black',
            fontFamily: 'Quicksand-Bold',
            fontSize: 24,
            padding: 20,
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
        <CustomButton
          children={[
            <Text
              key={'waiting_1'}
              style={{
                fontSize: 22,
                fontFamily: 'Quicksand-Bold',
                color: 'white',
              }}
            >
              Confirm
            </Text>,
          ]}
          additionStyles={{
            backgroundColor: '#06B4FA',
          }}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
