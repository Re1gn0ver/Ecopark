import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../../../shared/components/CustomButton/CustomButton';
import CustomInput from '../../../shared/components/CustomInput/CustomInput';
import { getHeight } from '../../../shared/components/Responsive/Responsive';
import ProfileOption from './ProfileOption';

function ProfileDetail({ navigation }) {
  const [userInfo, setuserInfo] = useState({});
  const [IsLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      const data = await AsyncStorage.getItem('info');
      setuserInfo(JSON.parse(data));
      setIsLoading(false);
    }
    getData();
  }, [IsLoading]);
  if (IsLoading) {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={'#06B4FA'} size={50} />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
      }}
    >
      <View
        style={[
          styles.row,
          {
            paddingTop: 30,
          },
        ]}
      >
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'Quicksand-Bold',
            fontSize: 24,
            color: 'black',
          }}
        >
          Profile Detail
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          color: 'black',
          width: '100%',
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        Name
      </Text>
      <DisableInput
        image={require('../../../shared/img/name.png')}
        content={userInfo.name}
      />
      <Text
        style={{
          fontSize: 20,
          color: 'black',
          width: '100%',
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        {' '}
        Identify Number
      </Text>
      <DisableInput
        image={require('../../../shared/img/iden-code.png')}
        content={userInfo.identifyNumber}
      />
      <Text
        style={{
          marginTop: 10,
          fontSize: 20,
          color: 'black',
          width: '100%',
          marginBottom: 10,
        }}
      >
        {' '}
        Resident Number
      </Text>
      <DisableInput
        image={require('../../../shared/img/recode.png')}
        content={userInfo.residentID}
      />
      <Text
        style={{
          marginTop: 10,

          fontSize: 20,
          color: 'black',
          width: '100%',
          marginBottom: 10,
        }}
      >
        {' '}
        Email address
      </Text>
      <DisableInput
        image={require('../../../shared/img/email.png')}
        content={userInfo.email}
      />
      <Text
        style={{
          marginTop: 10,

          fontSize: 20,
          color: 'black',
          width: '100%',
          marginBottom: 10,
        }}
      >
        {' '}
        Phone number
      </Text>
      <DisableInput
        image={require('../../../shared/img/email.png')}
        content={userInfo.phoneNumber}
      />
      <CustomButton
        children={[
          <Text
            key="profile-button-key"
            style={{
              fontFamily: 'Quicksand-Bold',
              fontSize: 22,
              color: 'white',
            }}
          >
            Comfirm
          </Text>,
        ]}
        onPress={() => {
          navigation.goBack();
        }}
        additionStyles={{
          height: getHeight(54),
          width: '100%',
          position: 'absolute',
          bottom: 10,
          borderRadius: 10,
          backgroundColor: '#06B4FA',
        }}
      />
    </View>
  );
}

const DisableInput = ({ image, content }) => {
  return (
    <View
      style={[
        styles.row,
        {
          paddingLeft: 15,
          height: getHeight(54),
          width: '100%',
          borderRadius: 10,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          backgroundColor: '#F0F0F0',
          elevation: 5,
        },
      ]}
    >
      <Image
        source={image}
        style={{
          height: 30,
          width: 30,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{
          paddingLeft: 10,
          color: 'black',
          fontFamily: 'Quicksand-Bold',
          fontSize: 20,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default ProfileDetail;
