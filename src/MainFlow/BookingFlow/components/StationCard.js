import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  TextInputBase,
  View,
  Text,
  Button,
  Image,
  TouchableOpacityBase,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  getHeight,
  getWidth,
} from '../../../shared/components/Responsive/Responsive';

// /*

// */

const StationCard = ({ stationInfo, onPress, selectedId }) => {
  const [selected, setSelected] = useState(false);

  const stationName = stationInfo.name;
  const location = stationInfo.location;
  const stationPhoneNumber = stationInfo.phoneNumber;
  function getDistance(location) {
    const defaultLocation = {
      latitude: 18.668161,
      longtitude: 105.669019,
    };
    const latitude = location.latitude;
    const longtitude = location.longtitude;
    const R = 6371e3; // metres
    const phi1 = (defaultLocation.latitude * Math.PI) / 180; // φ, λ in radians
    const phi2 = (latitude * Math.PI) / 180;
    const deltaPhi = ((latitude - defaultLocation.latitude) * Math.PI) / 180;
    const deltaLambda =
      ((longtitude - defaultLocation.longtitude) * Math.PI) / 180;
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in metres
    return d;
  }
  useEffect(() => {
    setSelected(selectedId === stationInfo._id);
    return () => {};
  }, [selectedId]);
  return (
    <TouchableOpacity
      style={{
        ...styles.stationCard,
        backgroundColor: selected ? '#06B4FA' : 'white',
      }}
      activeOpacity={0.33}
      onPress={() => {
        setSelected(!selected);
        if (!selected === false) onPress('', '');
        else onPress(stationInfo._id, stationName);
      }}
    >
      <View style={styles.titleLayout}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Text style={styles.titleText}>{stationName}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>OPEN</Text>
        </View>
      </View>
      <Text style={styles.locationText}>{location.name}</Text>
      <View style={styles.infoLayout}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        ></View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingRight: 20,
            alignItems: 'center',
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  stationCard: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    width: getWidth(351),
    height: getHeight(114),
    borderRadius: 10,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  titleLayout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: 'black',
  },
  subTitleText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'black',
    lineHeight: 15,
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF9E5',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  tagText: {
    color: '#F98600',
    fontFamily: 'Quicksand-Bold',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#50555C',
    lineHeight: 25,
  },
  infoLayout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
export default StationCard;
