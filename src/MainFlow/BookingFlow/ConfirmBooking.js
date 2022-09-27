import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../../shared/components/CustomButton/CustomButton';
import { getHeight } from '../../shared/components/Responsive/Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { io } from 'socket.io-client';
import ImageSource from '../../shared/img';

const CONFIRM = 1;
const START = 2;
const END = 3;
const BILL = 4;

function currencyFormat(num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    (date < 10 ? '0' + date : date) +
    ' ' +
    (month < 10 ? '0' + month : month) +
    ' ' +
    year +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (min < 10 ? '0' + min : min) +
    ':' +
    (sec < 10 ? '0' + sec : sec);
  return time;
}

function ConfirmBooking({ navigation, route }) {
  const { info } = route.params;
  const { option } = route.params;
  const [qr, setQr] = useState('');
  const [QR, setQR] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const [total, setTotal] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const endStation =
    info.billInfo != null ? info.billInfo.endStation : undefined;
  const [endDate, setEndDate] = useState(0);
  const [beginDate, setBeginDate] = useState(0);
  const rentDate = info.rentDate;
  const [bikeNumber, setBikeNumber] = useState('');
  const [billId, setBillId] = useState('');
  const [customer, setCustomer] = useState({});

  const res = {
    status: 'success',
    msg: 'login successfully',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MmQzYWU4ODAyODZjNzc1ZjgzNjRiZGIiLCJpYXQiOjE2NTgxMjQ3NTIsImV4cCI6MTY1ODE2MDc1Mn0.3cyjauoUMPIH5sy1ukb3vL5BJth3gdDcW27esCmLWW0',
    data: {
      _id: '62d3ae880286c775f8364bdb',
      identifyNumber: '023819310',
      password: '$2b$12$SCox0AYC1izDO1g0m7fU7ulQCYoS/UtFoBBi2bhZ8tM5AdMJhAObe',
      email: 'hoangnv@gmail.com',
      phoneNumber: '0981262965',
      name: 'Nguyen Hoang',
      balance: 0,
      residentID: '031230911',
      activate: 'false',
      role: 'user',
      __v: 0,
    },
    check: false,
  };

  const socket = io.connect('http://3137-27-67-92-150.ngrok.io');

  const cancelBike = async () => {
    const token = await AsyncStorage.getItem('token');
    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MmQzYWU4ODAyODZjNzc1ZjgzNjRiZGIiLCJpYXQiOjE2NTgxMjQ3NTIsImV4cCI6MTY1ODE2MDc1Mn0.3cyjauoUMPIH5sy1ukb3vL5BJth3gdDcW27esCmLWW0';
    const url = 'https://nmcnpm.herokuapp.com/api/v3/user/cancel/bike';
    axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then((res) => {
        if (res.data.status == 'fail') {
          navigation.navigate('Waiting', {
            message: 'timeout',
          });
        } else {
          navigation.navigate('Waiting', {
            message: 'cancleSuccessful',
          });
          setIsDisable(true);
        }
      });
  };

  const socketListener = () => {
    if (option == 2) {
      socket.on('rent_confirm', (data) => {
        navigation.goBack();
        if (data.data.status == 'fail') {
          if (data.data.msg == 'station reject') {
            navigation.navigate('Waiting', {
              message: 'stationReject',
            });
          } else {
            navigation.navigate('Waiting', {
              message: 'stationUnfoundBike',
            });
          }
        } else {
          navigation.navigate('Waiting', {
            message: 'successfulBooking',
          });
          setBeginDate(data.startTime);
          setIsDisable(true);
        }
      });
    } else {
      socket.on('return_confirm', (data) => {
        navigation.goBack();
        if (data.data.status == 'fail') {
          if (data.data.msg == 'station reject') {
            navigation.navigate('Waiting', {
              message: 'stationReject',
            });
          } else {
            navigation.navigate('Waiting', {
              message: 'stationUnfoundBike',
            });
          }
        } else {
          navigation.navigate('Waiting', {
            message: 'successfulFinishing',
          });
          setEndDate(data.returnTime);
          setTotal(data.data.bill.total);
          setIsDisable(true);
        }
      });
    }
  };
  socketListener();

  const QRHandle = (value) => {
    if (value == START && option == 2) {
      navigation.navigate('QR', {
        callBack: (value) => {
          setQr(value);
        },
      });
    }
    if (value == END && option == 3) {
      navigation.navigate('QR', {
        callBack: (value) => {
          setQR(value);
        },
      });
    }
  };

  const optionsProcess = () => {
    if (option == CONFIRM) {
      navigation.goBack();
      navigation.goBack();
      navigation.goBack();
      navigation.navigate('BookingSuccess');
      postBill();
    } else if (option == END) {
      if (QR != '') {
        finishBillProcess();
      }
    } else if (option == START) {
      if (qr != '') {
        startUsingProcess();
      }
    } else {
      navigation.goBack();
    }
  };

  const finishBillProcess = async () => {
    const data = {
      idBill: info.billInfo._id,
      image: info.billInfo.bike.category.image,
      licensePlate: info.billInfo.bike.numberPlate,
      renderName: 'Hello world',
      bikeCategory: info.billInfo.bike.category,
      timeRegister: info.billInfo.rentDate,
      socket_id: socket.id,
      stationName: info.stationName,
    };
    socket.emit('return', QR.split(':')[0], data);
    socket.emit('create', socket.id);
    navigation.navigate('Waiting', { message: 'waiting' });
  };

  const startUsingProcess = async () => {
    const data = {
      idBill: info.billInfo._id,
      image: info.billInfo.bike.category.image,
      licensePlate: info.billInfo.bike.numberPlate,
      renderName: 'Hello world',
      bikeCategory: info.billInfo.bike.category,
      timeRegister: info.billInfo.rentDate,
      socket_id: socket.id,
    };
    socket.emit('rent', qr.split(':')[0], data);
    socket.emit('create', socket.id);
    navigation.navigate('Waiting', { message: 'waiting' });
  };

  const postBill = async () => {
    const token = await AsyncStorage.getItem('token');
    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MmQzYWU4ODAyODZjNzc1ZjgzNjRiZGIiLCJpYXQiOjE2NTgxMjQ3NTIsImV4cCI6MTY1ODE2MDc1Mn0.3cyjauoUMPIH5sy1ukb3vL5BJth3gdDcW27esCmLWW0';
    const url = 'http://localhost:5000/api/v3/user/confirm/bike/' + billId;
    axios
      .get(url, { headers: { Authorization: 'Bearer ' + token } })
      .then((res) => {
        if (res.data.status == 'success') {
          navigation.navigate('BookingSuccess');
        } else {
          console.log(res.data);
        }
      });
  };

  useEffect(() => {
    const getBike = async () => {
      const userInfo = await AsyncStorage.getItem('info');
      setCustomer(JSON.parse(userInfo));
      if (option == CONFIRM) {
        const token = await AsyncStorage.getItem('token');
        // const token =
        //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MmQzYWU4ODAyODZjNzc1ZjgzNjRiZGIiLCJpYXQiOjE2NTgxMjQ3NTIsImV4cCI6MTY1ODE2MDc1Mn0.3cyjauoUMPIH5sy1ukb3vL5BJth3gdDcW27esCmLWW0';
        // const data = {
        //   stationID: info.stationId,
        //   categoryID: info.bikeId,
        // };
        const data = {
          stationID: '61a3aab88db24a7235ef7b4d',
          categoryID: '61b7182778daa3af1af0593c',
        };
        const url = 'https://nmcnpm.herokuapp.com/api/v3/user/book/bike';
        axios
          .post(url, data, { headers: { Authorization: 'Bearer ' + token } })
          .then((res) => {
            console.log(res.data);
            if (res.data.status == 'false') {
              navigation.goBack();
              navigation.goBack();
              navigation.goBack();
              navigation.navigate('Waiting', {
                message: 'duplicateBooking',
              });
            } else {
              // setBikeNumber(res.data.bike.numberPlate);
              // setBillId(res.data.bill._id);
              setBikeNumber('29A-2083');
              setBillId('10000122932');
              setIsLoading(false);
            }
          });
      } else if (option == START) {
        setIsLoading(false);
        setBikeNumber(info.billInfo.bike.numberPlate);
        setBeginDate(info.billInfo.rentDate);
      } else if (option == END) {
        setIsLoading(false);
        setBikeNumber(info.billInfo.bike.numberPlate);
        setBeginDate(info.billInfo.rentDate);
      } else if (option == BILL) {
        setIsLoading(false);
        setBikeNumber(info.billInfo.bike.numberPlate);
        setBeginDate(info.billInfo.rentDate);
        setEndDate(info.billInfo.endDate);
        setTotal(info.billInfo.total);
      }
    };
    getBike();
    return () => {};
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
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <View style={styles.imageContainer}>
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
          {option == 1
            ? 'Confirm your information'
            : option == 2
            ? 'Get bike'
            : 'Billing'}
        </Text>
      </View>
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          borderRadius: 15,
          ...styles.columnCenter,
          backgroundColor: '#F4F4F6',
          paddingHorizontal: 15,
          paddingVertical: 10,
          alignItems: 'flex-start',
        }}
      >
        <Text
          style={{
            ...styles.infoContent,
            color: 'black',
            fontFamily: 'Quicksand-Bold',
            fontSize: 20,
            alignSelf: 'center',
          }}
        >
          Booking Information
        </Text>
        <View style={{ ...styles.row_ct_sb, marginTop: 14 }}>
          <Text style={styles.infoTitle}>Customer</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.infoContent}>{customer.name}</Text>
        </View>

        <View style={{ ...styles.row_ct_sb, marginTop: 14 }}>
          <Text style={styles.infoTitle}>Bike number</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.infoContent}>{bikeNumber}</Text>
        </View>

        <View style={{ ...styles.row_ct_sb, marginTop: 14 }}>
          <Text style={styles.infoTitle}>Booking time</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.infoContent}>
            {endDate == 0
              ? new Date().getHours() + ':' + new Date().getMinutes()
              : ((endDate - rentDate) / 1000 / 60).toFixed(2) + ' mins'}
          </Text>
        </View>

        <View style={{ ...styles.row_ct_sb, marginTop: 14 }}>
          <Text style={styles.infoTitle}>Start Station</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.infoContent}>{info.stationName}</Text>
        </View>

        {/* <View style={{ ...styles.row_ct_sb, marginTop: 10 }}>
          <Text style={styles.infoTitle}>Total</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.infoContent}>
            {total <= 0 ? 'N/A' : currencyFormat(total)} VNĐ
          </Text>
        </View> */}
      </View>
      {/* <View style={{ ...styles.qrButton_container, marginTop: 10 }}>
        <TouchableOpacity
          style={{
            ...styles.qrButton,
            ...styles.columnCenter,
            backgroundColor: option == 1 ? '#F4F4F6' : '#06B4FA',
          }}
          onPress={() => QRHandle(START)}
        >
          <View style={styles.row_ct_sb}>
            <Text
              style={{
                ...styles.qrButton_title,
                color: option != 1 ? 'white' : 'black',
                marginLeft: 5,
              }}
            >
              Rent bike
            </Text>
          </View>
          <Text
            style={{
              color: option != 1 ? 'white' : 'black',
            }}
          >
            {beginDate == 0 || beginDate == undefined
              ? new Date().getHours() + ':' + new Date().getMinutes()
              : timeConverter(beginDate / 1000)}
          </Text>

          <Text
            style={{
              color: option != 1 ? 'white' : 'black',
            }}
          >
            {info.stationName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.qrButton,
            ...styles.columnCenter,
            backgroundColor: option == 1 ? '#F4F4F6' : '#06B4FA',
          }}
          onPress={() => {
            QRHandle(END);
          }}
        >
          <View style={styles.row_ct_sb}>
            <Text
              style={{
                ...styles.qrButton_title,
                color: option != 1 ? 'white' : 'black',
                marginLeft: 5,
              }}
            >
              Return bike
            </Text>
          </View>
          <Text
            style={{
              color: option != 1 ? 'white' : 'black',
            }}
          >
            {endDate == 0 || endDate == undefined
              ? 'N/A'
              : timeConverter(endDate / 1000)}
          </Text>
          <Text
            style={{
              color: option != 1 ? 'white' : 'black',
            }}
          >
            {option == 4
              ? endStation == undefined
                ? 'N/A'
                : endStation.name
              : QR != ''
              ? QR.split(':')[1]
              : 'N/A'}
          </Text>
        </TouchableOpacity>
      </View> */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          padding: 20,
        }}
      >
        {option == 2 ? (
          <CustomButton
            additionStyles={{
              ...styles.buttonStyle,
              backgroundColor: 'red',
            }}
            onPress={() => {
              if (!isDisable) {
                cancelBike();
              }
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
                Cancel
              </Text>,
            ]}
          />
        ) : (
          <View />
        )}
        {option == 2 ? (
          <View
            style={{
              width: 10,
              height: 10,
            }}
          />
        ) : (
          <View />
        )}
        <CustomButton
          additionStyles={{
            ...styles.buttonStyle,
            width: option == 2 ? '47%' : '94%',
          }}
          onPress={() => {
            if (!isDisable) {
              optionsProcess();
            }
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
              {option == 1
                ? 'Confirm'
                : option == 2
                ? 'Start using'
                : 'Confirm'}
            </Text>,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginBottom: 10,
    borderRadius: 10,
    height: 60,
    flex: 1,
    backgroundColor: '#06B4FA',
  },
  imageContainer: {
    padding: 10,
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  infoContent: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 18,
    color: '#595C65',
  },
  infoTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#595C65',
    marginLeft: 5,
  },
  icon: {
    height: 30,
    width: 30,
  },
  row_ct_sb: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButton_container: {
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  qrButton: {
    height: 80,
    width: '48%',
    borderRadius: 15,
  },
  qrButton_title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#595C65',
  },
  bikeImage: {
    height: getHeight(286),
    width: '100%',
    borderRadius: 15,
    backgroundColor: 'blue',
    resizeMode: 'cover',
  },
});
export default ConfirmBooking;
