import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HistoryCard from './components/HistoryCard';

function HistoryTab({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [history, setHistory] = React.useState([]);
  React.useEffect(() => {
    async function getBookingHistory() {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const url = 'https://nmcnpm.herokuapp.com/api/v3/user/booking/history';
      const response = await axios
        .get(url, { headers: { Authorization: 'Bearer ' + token } })
        .then((response) => {
          setHistory(response.data.data);
          setIsLoading(false);
        });
    }
    getBookingHistory();
    const willFocusSubscription = navigation.addListener('focus', () => {
      getBookingHistory();
    });
    return willFocusSubscription;
  }, []);

  if (isLoading) {
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
  } else {
    return (
      <View
        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
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
          History
        </Text>
        <ScrollView>
          {history.map((billInfo) => {
            return (
              <HistoryCard
                key={billInfo._id}
                billInfo={billInfo}
                navigation={navigation}
                status={billInfo.isCancel == true ? 'cancel' : 'done'}
              ></HistoryCard>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default HistoryTab;
