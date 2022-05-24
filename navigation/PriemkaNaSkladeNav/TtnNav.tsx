import React from 'react';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import TtnType from '../../screens/Ttn/TtnType';
import TtnList from '../../screens/Ttn/TtnList';
import TtnWorkMode from '../../screens/Ttn/TtnWorkMode';
import TtnPaletts from '../../screens/Ttn/TtnPaletts';
import TtnPalettsOld from '../../screens/Ttn/TtnPalettsOld';

enableScreens(true);
const Stack = createNativeStackNavigator();

const TtnNav = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName="TtnType"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen component={TtnType} name={'TtnType'} />
      <Stack.Screen component={TtnList} name={'TtnList'} />
      <Stack.Screen component={TtnWorkMode} name={'TtnWorkMode'} />
      <Stack.Screen component={TtnPaletts} name={'TtnPaletts'} />
      <Stack.Screen component={TtnPalettsOld} name={'TtnPalettsOld'} />
    </Stack.Navigator>
  );
};

export default TtnNav;
