'use strict';

import React, { useState } from 'react';
import { io } from 'socket.io-client';

import { Text, View } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import CustomButton from '../shared/components/CustomButton/CustomButton';

const socket = io.connect('http://f1f2-171-255-68-171.ngrok.io');
socket.on('rent_confirm', (data) => {
  console.log(data);
});
const ScanScreen = ({ navigation, route }) => {
  const { callBack } = route.params;
  const [info, setInfo] = useState('');
  return (
    <>
      <QRCodeScanner
        showMarker={true}
        onRead={(e) => {
          setInfo(e.data);
        }}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: 20,
              }}
            >
              Scan your end station to finish the trip
            </Text>
          </View>
        }
        bottomContent={
          <CustomButton
            onPress={() => {
              callBack(info);
              navigation.goBack();
            }}
            additionStyles={{
              marginBottom: 10,
              borderRadius: 10,
              height: 60,
              width: '95%',
              backgroundColor: '#06B4FA',
              position: 'absolute',
              bottom: 20,
            }}
            children={[
              <Text
                key="1"
                style={{
                  fontFamily: 'Quicksand-Bold',
                  fontSize: 18,
                  color: 'white',
                }}
              >
                {info == '' ? 'Scanning' : info.split(':')[1]}
              </Text>,
            ]}
          />
        }
      />
    </>
  );
};

export default ScanScreen;
