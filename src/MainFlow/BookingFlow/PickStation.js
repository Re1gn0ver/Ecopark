import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import StationCard from './components/StationCard';

function PickStation({ navigation }) {
  const [StationList, setStationList] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [SelectedID, setSelectedID] = useState('');
  const [StationName, setStationName] = useState('');
  useEffect(() => {
    async function getStationList() {
      const token = await AsyncStorage.getItem('token');
      const url = 'https://nmcnpm.herokuapp.com/api/v2/station/free';
      axios
        .get(url, { headers: { Authorization: 'Bearer ' + token } })
        .then((res) => {
          setStationList(res.data.data);
          setIsLoading(false);
        });
    }
    getStationList();
  }, []);
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
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          padding: 10,
          paddingTop: 30,
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TouchableOpacity
          style={{}}
          activeOpacity={0.3}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require('../../shared/img/back-button.png')}
            style={{
              height: 40,
              width: 40,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 0,
            fontFamily: 'Quicksand-Bold',
            fontSize: 22,
            color: 'black',
          }}
        >
          Select station
        </Text>
      </View>
      <SafeAreaView style={{ flex: 1, width: '100%', paddingBottom: 10 }}>
        <ScrollView
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 10,
          }}
        >
          {StationList.map((stationInfo) => (
            <StationCard
              selectedId={SelectedID}
              key={stationInfo._id}
              stationInfo={stationInfo}
              onPress={(id, name) => {
                setSelectedID(id);
                setStationName(name);
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
      <CustomButton
        additionStyles={{
          marginBottom: 10,
          borderRadius: 10,
          height: 60,
          width: '95%',
          backgroundColor: '#06B4FA',
        }}
        onPress={() => {
          if (SelectedID !== '')
            navigation.navigate('PickBike', {
              stationId: SelectedID,
              stationName: StationName,
            });
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
            Select station
          </Text>,
        ]}
      ></CustomButton>
    </View>
  );
}

export default PickStation;
