import React from 'react';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import PerNakl from '../../screens/PerNakl/PerNakl';
import PerNaklMenu from '../../screens/PerNakl/PerNaklMenu';
import PerNaklPaletts from '../../screens/PerNakl/PerNaklPaletts';
import PerNaklSpecs from '../../screens/PerNakl/PerNaklSpecs';
import PerNaklProvPaletts from '../../screens/PerNakl/PerNaklProvPaletts';
import DocumentCheckScreen from '../../screens/ProverkaPallets/DocumentCheckScreen';
import AddSomethingScreen from '../../screens/SystemScreens/AddSomethingScreen';

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
      <Stack.Screen component={PerNaklMenu} name={'PerNaklMenu'} />
      <Stack.Screen component={PerNaklPaletts} name={'PerNaklPaletts'} />
      <Stack.Screen component={PerNaklSpecs} name={'PerNaklSpecs'} />
      <Stack.Screen
        component={PerNaklProvPaletts}
        name={'PerNaklProvPaletts'}
      />
      <Stack.Screen
        component={DocumentCheckScreen}
        name={'DocumentCheckScreen'}
      />
      <Stack.Screen
        component={AddSomethingScreen}
        name={'AddGoodsInCheckScreen'}
      />
    </Stack.Navigator>
  );
};

export default PerNaklNav;
