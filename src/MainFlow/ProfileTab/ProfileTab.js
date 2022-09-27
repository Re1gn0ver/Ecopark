import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileOption from './components/ProfileOption';

function ProfileTab({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          marginTop: 20,
          marginBottom: 10,
          fontSize: 22,
          fontFamily: 'Quicksand-Bold',
          color: 'black',
        }}
      >
        Profile
      </Text>
      <View
        style={{
          width: '100%',
          borderRadius: 10,
          backgroundColor: '#E0F8BF',
          borderRadius: 15,
        }}
      >
        <ProfileOption
          icon={require('../../shared/img/profile-info.png')}
          onPress={() => {
            navigation.navigate('ProfileDetail', {
              userInfo: {
                Id: 'Hello world',
              },
            });
          }}
          title="User Infomation"
        />
        <ProfileOption
          icon={require('../../shared/img/profile-changePasswod.png')}
          onPress={() => {
            navigation.navigate('ChangePassword');
          }}
          title="Change Password"
        />
        <ProfileOption
          icon={require('../../shared/img/profile-logout.png')}
          onPress={() => {
            AsyncStorage.setItem('token', 'no');
            AsyncStorage.setItem('info', 'no');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }}
          title="Log out"
        />
      </View>
    </View>
  );
}

export default ProfileTab;
