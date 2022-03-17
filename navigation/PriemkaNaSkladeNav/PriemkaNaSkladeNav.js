import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import MenuPriemki from '../../screens/PriemkaNaSklade/MenuPriemki';
import GetBarcodeInfoScreen from '../../screens/GetBarcodeInfoScreen';
import BackToPostavshikNav from './BackToPostavshikNav';
import PerepalechivanieStackNav from './PerepalechivanieStackNav';
import PriemMestnyhNav from './PriemMestnyhNav';
import PriemPoStrihBumageNav from './PriemPoStrihBumageNav';
import CrossDockingNav from './CrossDockingNav';
import CheckPattlesNaSklade from './CheckPattlesNaSklade';

enableScreens();
const Stack = createNativeStackNavigator();

const PriemkaNaSkladeNav = ({user, podrazd}) => {
  return (
    <Stack.Navigator
      initialRouteName="ChoseInPriem"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen name="ChoseInPriem" component={MenuPriemki} />
      <Stack.Screen name="PriemMestnyhNav" component={PriemMestnyhNav} />
      <Stack.Screen
        name="PriemPoStrihBumageNav"
        component={PriemPoStrihBumageNav}
      />
      <Stack.Screen
        name="PerepalechivanieStackNav"
        component={PerepalechivanieStackNav}
      />
      <Stack.Screen
        name="BackToPostavshikNav"
        component={BackToPostavshikNav}
      />
      <Stack.Screen
        name="GetBarcodeInfoScreen"
        component={GetBarcodeInfoScreen}
      />
      <Stack.Screen name="CrossDockingNav" component={CrossDockingNav} />
      <Stack.Screen
        name="CheckPattlesNaSklade"
        component={CheckPattlesNaSklade}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(PriemkaNaSkladeNav);
