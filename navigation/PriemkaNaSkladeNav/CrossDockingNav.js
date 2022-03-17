import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import CrossDockingStore from '../../mobx/CrossDockingStore';
import CrossDock from '../../screens/PriemkaNaSklade/CrossDocking/CrossDock';
import MenuCrossDock from '../../screens/PriemkaNaSklade/CrossDocking/MenuCrossDock';

enableScreens();
const Stack = createNativeStackNavigator();

const CrossDockingNav = observer(({user, podrazd}) => {
  useEffect(() => {
    return () => {
      CrossDockingStore.resetStore();
    };
  }, []);
  return (
    <>
      <Stack.Navigator
        initialRouteName="MenuCrossDock"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          stackAnimation: 'none',
        }}
        headerMode="float">
        <Stack.Screen name="MenuCrossDock" component={MenuCrossDock} />
        <Stack.Screen name="CrossDock" component={CrossDock} />
      </Stack.Navigator>
    </>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(CrossDockingNav);
