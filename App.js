/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import Loading from './src/screen/Loading/Loading';
import Waiting from './src/screen/Waiting/Waiting';
import Login from './src/screen/Login/Login';
import Register from './src/screen/Register/Register';
import ResetPassword from './src/screen/ResetPassword/ResetPassword';
import ForgetPassword from './src/screen/ForgetPassword/ForgetPassword';
import MainFlow from './src/MainFlow/MainFlow';
import PickStation from './src/MainFlow/BookingFlow/PickStation';
import PickBike from './src/MainFlow/BookingFlow/PickBike';
import ConfirmBooking from './src/MainFlow/BookingFlow/ConfirmBooking';
import NonactiveAccountScreen from './src/screen/NonactiveAccount/NonactiveAccount';
import BookingSuccess from './src/MainFlow/BookingFlow/BookingSuccess';

const Stack = createNativeStackNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'white',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar hidden={true} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="MainFlow" component={MainFlow} />
        <Stack.Screen name="PickStation" component={PickStation} />
        <Stack.Screen name="PickBike" component={PickBike} />
        <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
        <Stack.Screen
          name="NonactiveAccount"
          component={NonactiveAccountScreen}
        />
        <Stack.Screen
          name="Waiting"
          component={Waiting}
          options={{ presentation: 'transparentModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
