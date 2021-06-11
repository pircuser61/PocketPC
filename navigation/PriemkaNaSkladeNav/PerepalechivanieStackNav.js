import {observer} from 'mobx-react-lite';
import React from 'react';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import LoadingComponent from '../../components/PriemPoStrihBumage/LoadingComponent';
import NakladNayaStore from '../../mobx/NakladNayaStore';
import ItemsListPerepalech from '../../screens/PriemkaNaSklade/Perepalechivanie/ItemsListPerepalech';
import PerepalechItem from '../../screens/PriemkaNaSklade/Perepalechivanie/PerepalechItem';
import SpecifyPalletsScreens from '../../screens/PriemkaNaSklade/Perepalechivanie/SpecifyPalletsScreens';
import StartPerepalech from '../../screens/PriemkaNaSklade/Perepalechivanie/StartPerepalech';
import ChooseOBScreen from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ChooseOBScreen';
import EnterPalletsNamesToNakladnaya from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/EnterPalletsNamesToNakladnaya';
import ItemStrihList from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ItemStrihList';
import PriemPoStrihBumage from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/PriemPoStrihBumage';
import ScreenForWorkWithNakladStrih from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/ScreenForWorkWithNakladStrih';
import WorkWithItemStihBumaga from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/WorkWithItemStihBumaga';
import WorkWithMarkirovkaStrihBumaga from '../../screens/PriemkaNaSklade/PriemPoStrihBumage/WorkWithMarkirovkaStrihBumaga';

enableScreens();
const Stack = createNativeStackNavigator();

const PerepalechivanieStackNav = observer(({user, podrazd}) => {
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
        <Stack.Screen name="StartPerepalech" component={StartPerepalech} />
        <Stack.Screen
          name="SpecifyPalletsScreens"
          component={SpecifyPalletsScreens}
        />
        <Stack.Screen
          name="ItemsListPerepalech"
          component={ItemsListPerepalech}
        />
        <Stack.Screen name="PerepalechItem" component={PerepalechItem} />
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

export default connect(mapStateToProps, {})(PerepalechivanieStackNav);
