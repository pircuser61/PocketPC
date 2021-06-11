import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import MenuPriemki from '../../screens/PriemkaNaSklade/MenuPriemki';
import PriemMestnyh from '../../screens/PriemkaNaSklade/PriemMestnyh/PriemMestnyh';
import WorkWithItemsInPallete from '../../screens/PriemkaNaSklade/PriemMestnyh/WorkWithItemsInPallete';
import WorkWithPallete from '../../screens/PriemkaNaSklade/PriemMestnyh/WorkWithPallete';
import WorkWithItem from '../../screens/PriemkaNaSklade/PriemMestnyh/WorkWithItem';
import WorkWithMarkirovka from '../../screens/PriemkaNaSklade/PriemMestnyh/WorkWithMarkirovka';

enableScreens();
const Stack = createNativeStackNavigator();



const PriemMestnyhNav = ({user, podrazd}) => {
  return (
      <Stack.Navigator
        initialRouteName="StartMestnyh"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          stackAnimation: 'none',
        }}
        headerMode="float">
              <Stack.Screen name="StartMestnyh" component={PriemMestnyh}/>
              <Stack.Screen name="WorkWithPallete" component={WorkWithPallete}/>
              <Stack.Screen name='WorkWithItemsInPallete' component={WorkWithItemsInPallete}/>
              <Stack.Screen name='WorkWithItemScreen' component={WorkWithItem}/>
              <Stack.Screen name='WorkWithMarkirovka' component={WorkWithMarkirovka}/>

      </Stack.Navigator>

  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(PriemMestnyhNav);
