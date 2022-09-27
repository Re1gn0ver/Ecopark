import * as React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
const NavigationTab = ({ info, isFocused, onPress }) => {
  const [tabState, setTabState] = useState(isFocused);
  useEffect(() => {
    setTabState(isFocused);
  }, [isFocused]);
  const styles = StyleSheet.create({
    onStyle: {
      padding: 10,
      backgroundColor: '#06B4FA',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
    onText: {
      fontSize: 20,
      fontFamily: 'Quicksand-Bold',
      color: 'white',
    },
    onContentStyle: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconStyle: {
      height: 30,
      width: 30,
      resizeMode: 'contain',
      marginRight: 10,
    },
    offStyle: {
      backgroundColor: 'transparent',
      padding: 10,
    },
    offIconStyle: {
      height: 30,
      width: 30,
      resizeMode: 'contain',
    },
  });
  return (
    <TouchableOpacity
      style={tabState ? styles.offStyle : styles.offStyle}
      activeOpacity={0.4}
      onPress={onPress}
    >
      <View style={styles.onContentStyle}>
        {tabState ? <View /> : <View />}
      </View>
    </TouchableOpacity>
  );
};

export default NavigationTab;
