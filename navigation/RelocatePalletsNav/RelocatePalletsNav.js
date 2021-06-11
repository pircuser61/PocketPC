import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import StartRelocate from '../../screens/RelocatePallets/StartRelocate';
import ChangeLocation from '../../screens/RelocatePallets/ChangeLocation';

enableScreens();
const Stack = createNativeStackNavigator();

const RelocatePalletsNav = ({user, podrazd}) => {
  return (
    <Stack.Navigator
      initialRouteName="StartRelocate"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen name="StartRelocate" component={StartRelocate} />
      <Stack.Screen name="ChangeLocation" component={ChangeLocation} />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(RelocatePalletsNav);
