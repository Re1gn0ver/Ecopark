import React, { useState, useEffect } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { getHeight, getWidth } from '../Responsive/Responsive';

const ShortBikeCard = ({
  selectedId,
  bikeInfo,
  backgroundColor,
  height,
  width,
  onLongPress,
  onPress,
}) => {
  const [selected, setSelected] = useState(false);

  const name = bikeInfo.name;
  const imageUrl = bikeInfo.image;
  const cost = bikeInfo.cost;
  const description = bikeInfo.description;
  useEffect(() => {
    setSelected(selectedId === bikeInfo._id);
    return () => {};
  }, [selectedId]);

  return (
    <TouchableOpacity
      style={{
        marginTop: 10,
        height: height === undefined ? getHeight(109) : getHeight(height),
        width: width === undefined ? getWidth(351) : getWidth(width),
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor:
          selected === true
            ? '#76B5C5'
            : backgroundColor === undefined
            ? 'white'
            : backgroundColor,
        display: 'flex',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      activeOpacity={0.2}
      onPress={() => {
        setSelected(!selected);
        if (!selected === false) onPress('', {});
        else onPress(bikeInfo._id, bikeInfo);
      }}
      onLongPress={() => {
        onLongPress();
      }}
    >
      <Image
        style={{
          height: '100%',
          width: '35%',
          resizeMode: 'contain',
          borderRadius: 10,
        }}
        source={{ uri: imageUrl }}
      />

      <View
        style={{
          paddingLeft: 10,
          flex: 3,
          height: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Quicksand-Bold',
          }}
        >
          {name.length > 20 ? name.substring(0, 19) + ' ...' : name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'normal',
            color: 'black',
          }}
        >
          {description.length > 90
            ? description.substring(0, 89) + '...'
            : description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShortBikeCard;
