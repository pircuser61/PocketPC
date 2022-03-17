import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {PlanogrammaNavProps} from '../../types/types';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import PlanogrammaStart from '../../screens/Planogramma/PlanogrammaStart';
import PlanogrammaWorkWithPallet from '../../screens/Planogramma/PlanogrammaWorkWithPallet';
import AddSomethingScreen from '../../screens/SystemScreens/AddSomethingScreen';

enableScreens(true);

const Stack = createNativeStackNavigator<PlanogrammaNavProps>();

export default function PlanogrammaNav(props: any) {
  return (
    <Stack.Navigator
      initialRouteName="PlanogrammaStart"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        //@ts-ignore
        gestureDirection: 'horizontal',
        stackAnimation: 'none',
      }}
      headerMode="float">
      <Stack.Screen
        component={PlanogrammaStart}
        name={'PlanogrammaStart'}
        //initialParams={}
      />
      <Stack.Screen
        component={PlanogrammaWorkWithPallet}
        name={'PlanogrammaWorkWithPallet'}
        //initialParams={}
      />
      <Stack.Screen
        component={AddSomethingScreen}
        name={'AddOrFindGood'}
        //initialParams={}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
