import {observer} from 'mobx-react-lite';
import React from 'react';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import LoadingComponent from '../../components/PriemPoStrihBumage/LoadingComponent';
import NakladNayaStore from '../../mobx/NakladNayaStore';
import ChooseOBScreen from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ChooseOBScreen';
import EnterPalletsNamesToNakladnaya from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/EnterPalletsNamesToNakladnaya';
import ItemStrihList from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ItemStrihList';
import PriemPoStrihBumage from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/PriemPoStrihBumage';
import ScreenForWorkWithNakladStrih from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ScreenForWorkWithNakladStrih';
import WorkWithItemStihBumaga from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/WorkWithItemStihBumaga';
import WorkWithMarkirovkaStrihBumaga from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/WorkWithMarkirovkaStrihBumaga';

enableScreens();
const Stack = createNativeStackNavigator();

const PriemPoStrihBumageNav = observer(({user, podrazd}) => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="PriemPoStrihBumage"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          stackAnimation: 'none',
        }}
        headerMode="float">
        <Stack.Screen
          name="PriemPoStrihBumage"
          component={PriemPoStrihBumage}
        />
        <Stack.Screen name="ChooseOBScreen" component={ChooseOBScreen} />
        <Stack.Screen
          name="ScreenForWorkWithNakladStrih"
          component={ScreenForWorkWithNakladStrih}
        />
        <Stack.Screen
          name="EnterPalletsNamesToNakladnaya"
          component={EnterPalletsNamesToNakladnaya}
        />
        <Stack.Screen name="ItemStrihList" component={ItemStrihList} />
        <Stack.Screen
          name="WorkWithItemStihBumaga"
          component={WorkWithItemStihBumaga}
        />
        <Stack.Screen
          name="WorkWithMarkirovkaStrihBumaga"
          component={WorkWithMarkirovkaStrihBumaga}
        />
      </Stack.Navigator>

      {NakladNayaStore.loading ? <LoadingComponent /> : null}
    </>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(PriemPoStrihBumageNav);
