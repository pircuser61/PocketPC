import React from 'react';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import PerNakl from './PerNakl';
import PerNaklMenu from './PerNaklMenu';
import PerNaklPaletts from './PerNaklPaletts';
import PerNaklSpecs from './PerNaklSpecs';
import PerNaklProvPaletts from './PerNaklProvPaletts';
import DocumentCheckScreen from '../ProverkaPallets/DocumentCheckScreen';
import AddSomethingScreen from '../SystemScreens/AddSomethingScreen';
import MarkHonest from '../../screens/Common/MarkHonest';

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
      <Stack.Screen component={MarkHonest} name={'MarkHonest'} />
    </Stack.Navigator>
  );
};

export default PerNaklNav;
