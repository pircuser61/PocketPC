import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import {ProvfreeRow} from '../../functions/PocketProvfreeList';
import AddGoodsInCheckScreen from '../../screens/ProverkaPallets/AddGoodsInCheckScreen';
import CreateCheckScreen from '../../screens/ProverkaPallets/CreateCheckScreen';
import CreatePalletInCheckScreen from '../../screens/ProverkaPallets/CreatePalletInCheckScreen';
import DocumentCheckScreen from '../../screens/ProverkaPallets/DocumentCheckScreen';
import GoodsScreen from '../../screens/ProverkaPallets/GoodsScreen';
import NewGlobalCheck from '../../screens/ProverkaPallets/NewGlobalCheck';
import PrintCheckScreen from '../../screens/ProverkaPallets/PrintCheckScreen';
import WorkWithCheck from '../../screens/ProverkaPallets/WorkWithCheck';
import AddSomethingScreen from '../../screens/SystemScreens/AddSomethingScreen';
import AddNewVykladla from '../../screens/Vykladka/AddNewVykladla';
import GoodsInVykladkaScreen from '../../screens/Vykladka/GoodsInVykladkaScreen';
import VykladkaStart from '../../screens/Vykladka/VykladkaStart';
import {AddGoodsInCheckScreenParamsProps} from '../../types/types';

export type VykladkaNavProps = {
  VykladkaStart: undefined;
  AddNewVykladla: {
    addNewElementToList: (item: ProvfreeRow) => void;
    changeElementInList: (item: ProvfreeRow) => void;
    mode: 'create' | 'edit';
    propitem?: ProvfreeRow;
  };
  GoodsInVykladkaScreen: {
    propitem: ProvfreeRow;
  };
  AddOrFindGood: AddGoodsInCheckScreenParamsProps;
};

enableScreens();
const Stack = createNativeStackNavigator<VykladkaNavProps>();

const VykladkaNav = () => {
  //console.log(route.params);
  return (
    <Stack.Navigator
      initialRouteName="VykladkaStart"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen
        //initialParams={route.params}
        component={VykladkaStart}
        name={'VykladkaStart'}
      />
      <Stack.Screen
        //initialParams={route.params}
        component={AddNewVykladla}
        name={'AddNewVykladla'}
      />
      <Stack.Screen
        //initialParams={route.params}
        component={GoodsInVykladkaScreen}
        name={'GoodsInVykladkaScreen'}
      />
      <Stack.Screen
        //initialParams={route.params}
        component={AddSomethingScreen}
        name={'AddOrFindGood'}
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

export default connect(mapStateToProps, {})(VykladkaNav);
