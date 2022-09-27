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
import ShortBikeCard from '../../shared/components/ShortBikeCard/ShortBikeCard';

function PickBike({ navigation, route }) {
  const { stationId, stationName } = route.params;
  const [BikeList, setBikeList] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [selected, setselected] = useState('');
  const [info, setBikeInfo] = useState({});

  useEffect(() => {
    async function getStationList() {
      const token = await AsyncStorage.getItem('token');
      const url =
        'https://nmcnpm.herokuapp.com/api/v3/category/free/' + stationId;
      axios
        .get(url, { headers: { Authorization: 'Bearer ' + token } })
        .then((res) => {
          setBikeList(res.data.data);
          setIsLoading(false);
        });
    }
    getStationList();
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
          Select bike
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
          {BikeList.map((bikeInfo) => {
            return (
              <ShortBikeCard
                selectedId={selected}
                key={bikeInfo[0]._id}
                bikeInfo={bikeInfo[0]}
                onPress={(id, info) => {
                  setselected(id);
                  setBikeInfo(info);
                }}
                onLongPress={() => {
                  navigation.navigate('ShowBikeInfo', {
                    bikeInfo: bikeInfo[0],
                    pickClick: () => {
                      setselected(bikeInfo[0]._id);
                      setBikeInfo(bikeInfo[0]);
                      navigation.goBack();
                    },
                  });
                }}
              />
            );
          })}
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
          if (selected !== '')
            navigation.navigate('ConfirmBooking', {
              info: {
                stationId: stationId,
                bikeId: selected,
                bikeInfo: info,
                stationName: stationName,
              },
              option: 1,
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
            Select bike
          </Text>,
        ]}
      ></CustomButton>
    </View>
  );
}

export default PickBike;
