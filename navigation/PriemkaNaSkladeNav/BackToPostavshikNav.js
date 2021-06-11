import {observer} from 'mobx-react-lite';
import React from 'react';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {connect} from 'react-redux';
import BackToPostItem from '../../screens/PriemkaNaSklade/BackToPostavshik/BackToPostItem';
import ItemListBackToPost from '../../screens/PriemkaNaSklade/BackToPostavshik/ItemListBackToPost';
import StartBackToPostavshik from '../../screens/PriemkaNaSklade/BackToPostavshik/StartBackToPostavshik';

enableScreens();
const Stack = createNativeStackNavigator();

const BackToPostavshikNav = observer(({user, podrazd}) => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="StartBackToPostavshik"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          stackAnimation: 'none',
        }}
        headerMode="float">
        <Stack.Screen
          name="StartBackToPostavshik"
          component={StartBackToPostavshik}
        />
        <Stack.Screen
          name="ItemListBackToPost"
          component={ItemListBackToPost}
        />
        <Stack.Screen name="BackToPostItem" component={BackToPostItem} />
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

export default connect(mapStateToProps, {})(BackToPostavshikNav);
