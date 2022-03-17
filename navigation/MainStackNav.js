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
import GetBarcodeInfoScreen from '../screens/GetBarcodeInfoScreen';
import ChooseShop from '../screens/ChooseShop';
import {observer} from 'mobx-react-lite';
import ShopStore from '../mobx/ShopStore';
import LoadingScreen from '../screens/LoadingScreen';
import SandBox from '../screens/SandBox';
import GlobalCheckNav from './ProverkaPallet/GlodalCheckNav';
import Inventarization from '../screens/Inventatization';
import ProverkaNakladnyh from './ProverkaNakladnyh/ProverkaNakladnyhNav';
import PlanogrammaNav from './Planogramma/PlanogrammaNav';
import VykladkaNav from './Vykladka/VykladkaNav';

enableScreens();
const Stack = createNativeStackNavigator();

const MainStackNav = observer(({user, podrazd}) => {
  useEffect(() => {
    ShopStore.getShopFromAsync();
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
          {user && ShopStore.shopName.length ? (
            <>
              {podrazd.Name.length > 0 ? (
                <>
                  <Stack.Screen name="HomeScreen" component={HomeScreen} />
                  <Stack.Screen name="ChangeShop" component={MainShopMenu} />
                  <Stack.Screen
                    name="NextChangeShop"
                    component={NextShopMenu}
                  />
                  <Stack.Screen name="m-mh-reprint" component={ScannerScreen} />
                  <Stack.Screen name="m-prog1" component={Inventarization} />
                  <Stack.Screen name="m-prog2" component={PriemkaNaSkladeNav} />
                  <Stack.Screen name="CheckMenu" component={GlobalCheckNav} />
                  <Stack.Screen
                    name="m-prog12"
                    component={RelocatePalletsNav}
                  />
                  <Stack.Screen
                    name="GetBarcodeInfoScreen"
                    component={GetBarcodeInfoScreen}
                  />
                  <Stack.Screen
                    name={'m-prog14'}
                    component={ProverkaNakladnyh}
                  />
                  <Stack.Screen name={'m-prog4'} component={PlanogrammaNav} />
                  <Stack.Screen name={'m-prog7'} component={VykladkaNav} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home" component={MainShopMenu} />
                  <Stack.Screen name="Details" component={NextShopMenu} />
                </>
              )}
            </>
          ) : !ShopStore.isReady ? (
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          ) : ShopStore.shopName.length ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen
                name="GetBarcodeInfoScreen"
                component={GetBarcodeInfoScreen}
              />
            </>
          ) : (
            <Stack.Screen name="ChooseShop" component={ChooseShop} />
          )}
          <Stack.Screen name="SandBox" component={SandBox} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(MainStackNav);
