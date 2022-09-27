import * as React from 'react';
import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function currencyFormat(num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const HistoryCard = ({ billInfo, status, navigation }) => {
  console.log(billInfo);
  return (
    <TouchableOpacity
      style={{
        backgroundColor:
          billInfo.isCancel == true || billInfo.total == null
            ? '#FFBABA'
            : billInfo.total == -1
            ? '#72eded'
            : billInfo.total === 0
            ? '#FFFF00'
            : '#DFFEB4',
        ...styles.row,
        ...styles.card,
      }}
      onPress={() => {
        navigation.navigate('ConfirmBooking', {
          info: {
            billId: billInfo._id,
            bikeId: billInfo.bike._id,
            stationId: billInfo.station._id,
            stationName: billInfo.station.name,
            bikeInfo: billInfo.bike.category,
            rentDate: billInfo.rentDate,
            billInfo: billInfo,
          },
          option:
            billInfo.isCancel == true
              ? 4
              : billInfo.total == -1
              ? 2
              : billInfo.total == 0
              ? 3
              : 4,
        });
      }}
    >
      <Image
        style={{
          height: '100%',
          flex: 3,
          borderRadius: 15,
          resizeMode: 'cover',
        }}
        source={{ uri: billInfo.bike.category.image }}
      />
      <View
        style={{
          flex: 5,
          marginLeft: 10,
          justifyContent: 'space-between',
          ...styles.column,
        }}
      >
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: 'Quicksand-Bold',
              fontSize: 14,
              color: '#06B4FA',
            }}
          >
            ID:{' '}
            {billInfo._id.substring(
              billInfo._id.length - 6,
              billInfo._id.length
            )}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Quicksand-Medium',
                fontSize: 14,
                color: '#293D8F',
              }}
            >
              More details
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: 'Quicksand-Medium',
            fontSize: 15,
            color: 'black',
          }}
        >
          Status:
          {billInfo.rentDate == undefined
            ? ' Booking'
            : billInfo.endDate == undefined
            ? ' Using'
            : ' Done'}
        </Text>
        <Text
          style={{
            fontFamily: 'Quicksand-Medium',
            fontSize: 15,
            color: 'black',
          }}
        >
          Total money:{' '}
          {billInfo.total != undefined
            ? currencyFormat(billInfo.total) + ' VNĐ'
            : '...'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  card: {
    marginTop: 5,
    marginBottom: 5,
    height: getHeight(109),
    width: getWidth(336),
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HistoryCard;
