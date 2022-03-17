//m-prog14
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import AddGoodsInNakladnayaScreen from '../../screens/ProverkaNakladnyh/AddGoodsInNakladnayaScreen';
import AddNakladnyaScreen from '../../screens/ProverkaNakladnyh/AddNakladnyaScreen';
import CreateProverka from '../../screens/ProverkaNakladnyh/CreateProverka';
import FilterNakladnyhScreen from '../../screens/ProverkaNakladnyh/FilterNakladnyhScreen';
import GoodsListScreenInProverka from '../../screens/ProverkaNakladnyh/GoodsListScreenInProverka';
import ProverkaNakladnyhStart from '../../screens/ProverkaNakladnyh/ProverkaNakladnyhStart';
import WorkWithNakladnaya from '../../screens/ProverkaNakladnyh/WorkWithNakladnaya';
import AddSomethingScreen from '../../screens/SystemScreens/AddSomethingScreen';
import {ProverkaNakladnyhNavProps} from '../../types/types';

enableScreens(true);
const Stack = createNativeStackNavigator<ProverkaNakladnyhNavProps>();

const ProverkaNakladnyhNav = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName="ProverkaNakadnyhStart"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen
        component={ProverkaNakladnyhStart}
        name={'ProverkaNakadnyhStart'}
        initialParams={props.route.params}
      />
      <Stack.Screen
        component={FilterNakladnyhScreen}
        name={'FilterNakladnyhScreen'}
        initialParams={props.route.params}
      />
      <Stack.Screen
        component={WorkWithNakladnaya}
        name={'WorkWithNakladnaya'}
        initialParams={props.route.params}
      />
      <Stack.Screen
        component={GoodsListScreenInProverka}
        name={'GoodsListScreenInProverka'}
        initialParams={props.route.params}
      />
      <Stack.Screen
        component={AddSomethingScreen}
        name={'AddGoodsInNakladnayaScreen'}
        initialParams={props.route.params}
      />
      <Stack.Screen
        component={AddNakladnyaScreen}
        name={'AddNakladnyaScreen'}
        initialParams={props.route.params}
      />
      <Stack.Screen component={CreateProverka} name={'CreateProverka'} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(ProverkaNakladnyhNav);
