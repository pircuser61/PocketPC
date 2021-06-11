import React, {useEffect} from 'react';
import {View} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import MainShopMenu from '../screens/MainShopMenu';
import NextShopMenu from '../screens/NextShopMenuScreen';
import {connect} from 'react-redux';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import PriemkaNaSkladeNav from './PriemkaNaSkladeNav/PriemkaNaSkladeNav';
import DeviceInfo from 'react-native-device-info';
import RelocatePalletsNav from './RelocatePalletsNav/RelocatePalletsNav';

enableScreens();
const Stack = createNativeStackNavigator();

const MainStackNav = ({user, podrazd}) => {
  useEffect(() => {
    console.log(DeviceInfo.getVersion());
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            stackAnimation: 'none',
          }}
          headerMode="float">
          {user ? (
            <>
              {podrazd.Name.length > 0 ? (
                <>
                  <Stack.Screen name="123" component={HomeScreen} />
                  <Stack.Screen name="ChangeShop" component={MainShopMenu} />
                  <Stack.Screen
                    name="NextChangeShop"
                    component={NextShopMenu}
                  />
                  <Stack.Screen name="m-mh-reprint" component={ScannerScreen} />
                  <Stack.Screen name="m-prog2" component={PriemkaNaSkladeNav} />
                  <Stack.Screen
                    name="m-prog12"
                    component={RelocatePalletsNav}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home" component={MainShopMenu} />
                  <Stack.Screen name="Details" component={NextShopMenu} />
                </>
              )}
            </>
          ) : (
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(MainStackNav);
