import React from 'react';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import PerNakl from '../../screens/PerNakl/PerNakl';
import PerNaklMenu from '../../screens/PerNakl/PerNaklMenu';
import PerNaklPaletts from '../../screens/PerNakl/PerNaklPaletts';
import PerNaklSpecs from '../../screens/PerNakl/PerNaklSpecs';

enableScreens(true);
const Stack = createNativeStackNavigator();

const PerNaklNav = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName="PerNakl"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen component={PerNakl} name={'PerNakl'} />
      <Stack.Screen component={PerNaklMenu} name={'PerNaklInfo'} />
      <Stack.Screen component={PerNaklPaletts} name={'PerNaklPaletts'} />
      <Stack.Screen component={PerNaklSpecs} name={'PerNaklSpecs'} />
    </Stack.Navigator>
  );
};

export default PerNaklNav;
