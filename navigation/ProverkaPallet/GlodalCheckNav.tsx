import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import AddGoodsInCheckScreen from '../../screens/ProverkaPallets/AddGoodsInCheckScreen';
import CreateCheckScreen from '../../screens/ProverkaPallets/CreateCheckScreen';
import CreatePalletInCheckScreen from '../../screens/ProverkaPallets/CreatePalletInCheckScreen';
import DocumentCheckScreen from '../../screens/ProverkaPallets/DocumentCheckScreen';
import GoodsScreen from '../../screens/ProverkaPallets/GoodsScreen';
import NewGlobalCheck from '../../screens/ProverkaPallets/NewGlobalCheck';
import PrintCheckScreen from '../../screens/ProverkaPallets/PrintCheckScreen';
import WorkWithCheck from '../../screens/ProverkaPallets/WorkWithCheck';
import AddSomethingScreen from '../../screens/SystemScreens/AddSomethingScreen';
import {GlobalCheckNavProps} from '../../types/types';

enableScreens();
const Stack = createNativeStackNavigator<GlobalCheckNavProps>();

const GlobalCheckNav = ({user, podrazd, route}: GlobalCheckNavProps & any) => {
  //console.log(route.params);
  return (
    <Stack.Navigator
      initialRouteName="GlobalProverka"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen
        initialParams={route.params}
        component={NewGlobalCheck}
        name={'GlobalProverka'}
      />
      <Stack.Screen
        initialParams={route.params}
        component={CreateCheckScreen}
        name={'CreateCheckScreen'}
      />
      <Stack.Screen component={WorkWithCheck} name={'WorkWithCheck'} />
      <Stack.Screen
        component={DocumentCheckScreen}
        //component={GoodsScreen}
        name={'DocumentCheckScreen'}
      />
      <Stack.Screen
        component={CreatePalletInCheckScreen}
        name={'CreatePalletInCheckScreen'}
      />
      <Stack.Screen component={PrintCheckScreen} name={'PrintCheckScreen'} />
      <Stack.Screen
        component={AddSomethingScreen}
        name={'AddGoodsInCheckScreen'}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(GlobalCheckNav);
