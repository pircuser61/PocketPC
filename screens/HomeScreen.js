import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  TouchableOpacity,
  View,
  Text,
  Vibration,
} from 'react-native';
import RNBeep from 'react-native-a-beep';
import HeaderHomeScreen from '../components/HeaderHomeScreen';
import {PocketMenu} from '../functions/PocketMenu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import {exitToAuthThunk} from '../redux/reducer';
import {alertActions} from '../constants/funcrions';
import {ScrollView} from 'react-native-gesture-handler';

const HomeScreen = ({navigation, userRedux, exitToAuthThunk, podrazd}) => {
  const [menuList, setMenuList] = useState([]);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {user} = userRedux;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fu();
  }, []);

  const fu = () => {
    PocketMenu(
      user['$']['city.cod'],
      podrazd.Id,
      user['TokenData'][0]['$']['UserUID'],
    )
      .then(r => {
        const firstMass = [];
        r.map(r => {
          if (
            r['$']['Trigger'] === 'm-mh-reprint' ||
            r['$']['Trigger'] === 'm-prog2' ||
            r['$']['Trigger'] === 'm-prog12'
          ) {
            firstMass.push({...r, ready: true});
          } else {
            firstMass.push({...r, ready: false});
          }
        });
        setMenuList(firstMass);
        setRefreshing(false);
      })
      .catch(e => {
        alertActions(e);
        setRefreshing(false);
        console.log(
          '\x1b[31m',
          `\nПроизошла ошибка в функции PocketMenu\n${e}\n<----------------------------------------------------------------------->`,
          '\x1b[0m',
        );
      });
  };

  useEffect(() => {
    fu();
  }, []);

  return (
    <>
      <HeaderHomeScreen
        user={userRedux.user.TokenData[0]}
        exitToAuthThunk={exitToAuthThunk}
        navigation={navigation}
        podrazd={podrazd}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {menuList
          .sort((a, b) => b.ready - a.ready || a.$.Order - b.$.Order)

          .map((r, i) => {
            // console.log(r)
            //m-mh-reprint
            return (
              <TouchableOpacity
                disabled={!r.ready}
                onPress={() => {
                  navigation.navigate(r['$']['Trigger']);
                  //console.log(r);
                }}
                key={i}
                style={{
                  marginTop: 10,
                  marginRight: 0,
                  opacity: r.ready ? 1 : 0.2,
                  marginLeft: 16,
                }}>
                <Text style={{fontSize: 20}}>{r['$']['Label']}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    opacity: 0.6,
                    fontWeight: '400',
                    marginBottom: 10,
                  }}>
                  {podrazd.Name}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="black"
                  style={{position: 'absolute', right: 16, marginTop: 10}}
                />
                <Divider />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </>
  );
};

const mapStateToProps = state => {
  return {
    userRedux: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {exitToAuthThunk})(HomeScreen);
