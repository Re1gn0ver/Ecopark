import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import ShortBikeCard from '../../shared/components/ShortBikeCard/ShortBikeCard';

function BookingSuccess({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../shared/img/bookingsuccess.png')}
        style={{
          top: 150,
          height: 400,
          width: 400,
          resizeMode: 'contain',
          // position: "absolute",
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 505,
        }}
      >
        <Text
          style={{
            fontFamily: 'Quicksand-Bold',
            fontSize: 24,
          }}
        >
          Đặt xe thành công!
        </Text>
        <Text
          style={{
            marginTop: 10,
            width: 300,
            fontFamily: 'Quicksand-Bold',
            fontSize: 18,
            textAlign: 'center',
          }}
        >
          Chúc bạn có một trải nghiệm tuyệt vời tại Ecopark!
        </Text>
      </View>
      <CustomButton
        additionStyles={{
          marginBottom: 10,
          borderRadius: 10,
          height: 60,
          width: '95%',
          backgroundColor: '#06B4FA',
          position: 'absolute',
          bottom: 20,
        }}
        onPress={() => {
          navigation.goBack();
        }}
        children={[
          <Text
            key="1"
            style={{
              fontFamily: 'Quicksand-Bold',
              fontSize: 24,
              color: 'white',
            }}
          >
            Confirm
          </Text>,
        ]}
      ></CustomButton>
    </View>
  );
}

export default BookingSuccess;
