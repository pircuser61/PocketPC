import React, {useEffect, useState} from 'react';
import {
  RefreshControl,
  TouchableOpacity,
  View,
  Text,
  Vibration,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import RNBeep from 'react-native-a-beep';
import HeaderHomeScreen from '../components/HeaderHomeScreen';
import {PocketMenu} from '../functions/PocketMenu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import {exitToAuthThunk} from '../redux/reducer';
import {
  alertActions,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../constants/funcrions';

import {enableFreeze} from 'react-native-screens';
import {PocketCron} from '../functions/PocketCron';
import LoadingFlexComponent from '../components/SystemComponents/LoadingFlexComponent';

//enableFreeze(true);

const HomeScreen = ({navigation, userRedux, exitToAuthThunk, podrazd}) => {
  const [menuList, setMenuList] = useState([]);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {user} = userRedux;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fu();
  }, []);

  const fu = React.useCallback(() => {
    PocketMenu(
      user['$']['city.cod'],
      podrazd.Id,
      user['TokenData'][0]['$']['UserUID'],
    )
      .then(r => {
        const firstMass = [];
        r.map(r => {
          //console.log(r);
          if (
            r['$']['Trigger'] === 'm-mh-reprint' ||
            r['$']['Trigger'] === 'm-prog1' ||
            r['$']['Trigger'] === 'm-prog2' ||
            r['$']['Trigger'] === 'm-prog4' ||
            r['$']['Trigger'] === 'm-prog7' ||
            r['$']['Trigger'] === 'm-prog9' ||
            r['$']['Trigger'] === 'm-prog10' ||
            r['$']['Trigger'] === 'm-prog12' ||
            r['$']['Trigger'] === 'm-prog13' ||
            r['$']['Trigger'] === 'm-prog14'

            //m-prog7
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
  });

  useEffect(() => {
    //navigation.navigate('m-prog10');
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
        {refreshing && menuList.length === 0 && <LoadingFlexComponent />}
        {menuList
          .sort((a, b) => b.ready - a.ready || a.$.Order - b.$.Order)
          .map((r, i) => {
            return (
              <TouchableOpacity
                disabled={!r.ready}
                onPress={() => {
                  if (
                    r['$']['Trigger'] === 'm-prog10' ||
                    r['$']['Trigger'] === 'm-prog9'
                  ) {
                    let params = {Type: '', title: ''};
                    switch (r['$']['Trigger']) {
                      case 'm-prog10':
                        params.Type = '6';
                        params.title = 'Проверка паллет';
                        break;
                      case 'm-prog9':
                        params.Type = '5';
                        params.title = 'Проверка планограммы';

                      default:
                        break;
                    }

                    navigation.navigate('CheckMenu', params);
                  } else if (r['$']['Trigger'] === 'm-prog14') {
                    let params = {Type: '1', title: 'Проверка накладных'};
                    navigation.navigate('m-prog14', params);
                  } else navigation.navigate(r['$']['Trigger']);
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
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    opacity: 0.6,
                    fontWeight: '400',
                    marginBottom: 10,
                    marginRight: 32,
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
