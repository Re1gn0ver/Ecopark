import * as React from 'react';
import { useNavigationBuilder, TabRouter } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './CustomBottomNavigationBar/TabBar';
import HistoryTab from './HistoryTab/HistoryTab';
import ProfileTab from './ProfileTab/ProfileTab';
import BookingTab from './BookingTab/BookingTab';
// import MoneyStatus from './BookingTab/components/MoneyStatus';
// import { View } from 'react-native';
// import ShortBikeCard from '../shared/components/ShortBikeCard/ShortBikeCard';
// import BookingButton from './BookingTab/components/BookingButton';
// import StationCard from './BookingFlow/components/StationCard';
// import BikeCard from './BookingFlow/components/BikeCard';
// import { back } from 'react-native/Libraries/Animated/Easing';

const stationInfo = {
  isDelete: false,
  _id: '619e7bc033bbc513096ead10',
  bikeAmount: 20,
  staff: {
    _id: '619f4215b1a9b4caee641ab9',
    identifyNumber: '001201011',
    password: '$2b$12$LVAmRSEHmXrYafvv2ngZTO2JDqeDNzSHgvqsm4fcj5xcut7w4YIx6',
    email: 'kiend9814@gmail.com',
    phoneNumber: '0978252102',
    name: 'Đào Trung Kiên',
    address: 'hnnnnn',
    staffID: '1637827093108',
    role: 'staff',
    __v: 0,
  },
  location: {
    _id: '619caae9d6eadc68431c5132',
    name: 'Số 1 Đại Cồ Việt, Quận Hai Bà Trưng',
    longtitude: 100.01191,
    latitude: 990.17152,
    __v: 0,
  },
  __v: 0,
  name: 'Station #9928',
  phoneNumber: '01018888',
};

const Tab = createBottomTabNavigator();
export default function MainFlow() {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder(TabRouter, {
      children: [
        <Tab.Screen name="Booking" component={BookingTab} />,
        // <Tab.Screen name="Profile" component={ProfileTab} />,
      ],
      initialRouteName: 'Booking',
    });
  return (
    <NavigationContent>
      <TabBar state={state} descriptors={descriptors} navigation={navigation} />
    </NavigationContent>
  );
}
