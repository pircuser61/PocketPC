import {action} from 'mobx';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import HeaderForChooseShop from '../components/HeaderForChooseShop';
import {MAIN_COLOR, SCREEN_WIDTH} from '../constants/funcrions';
import {PocketAvailShops} from '../functions/PocketAvailShops';
import {exitToAuthThunk} from '../redux/reducer';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const MainShopMenu = ({navigation, route, exitToAuthThunk, podrazd, user}) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(true);

  let mounted = true;

  const updateInfo = async () => {
    try {
      setError('');
      setRefreshing(true);
      let response = await PocketAvailShops(
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      );
      if (mounted) {
        setList(response);
      } else {
        console.log('размонтировано');
      }
    } catch (error) {
      setList([]);
      setError(error);
    } finally {
      if (mounted) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    updateInfo();
    return () => {
      mounted = false;
    };
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          height: 68,
          justifyContent: 'center',
          borderBottomColor: 'grey',
          marginLeft: 16,
        }}
        onPress={() => {
          if (podrazd.Id.length === 0) {
            navigation.push('Details', {OPshop: item});
          } else {
            navigation.push('NextChangeShop', {OPshop: item});
          }
        }}>
        <Text style={{fontSize: 20, opacity: 0.87}}>{item['$']['Id']}</Text>
        <Text style={{fontSize: 14, opacity: 0.6, marginBottom: 10}}>
          {item['$']['Name']}
        </Text>
        <Divider />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <HeaderForChooseShop
        podrazd={podrazd}
        title={'Подразделения'}
        isSecond={false}
        navigation={navigation}
        exitToAuthThunk={exitToAuthThunk}
      />
      {Array.isArray(list) && list.length ? (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => item['$']['Id'] + index}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={updateInfo} />
          }
        />
      ) : error.length ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              position: 'absolute',
              bottom: 16,
              width: '100%',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={updateInfo} style={styles.button}>
              <Text style={styles.buttonFont}>ОБНОВИТЬ</Text>
              <MaterialIcon
                name={'reload'}
                style={{position: 'absolute', right: 16}}
                size={16}
                color={'white'}
              />
            </TouchableOpacity>
            <View style={{height: 8}} />
            <TouchableOpacity onPress={exitToAuthThunk} style={styles.button}>
              <Text style={styles.buttonFont}>ВЫЙТИ</Text>
              <MaterialIcon
                name={'exit-to-app'}
                style={{position: 'absolute', right: 16}}
                size={16}
                color={'white'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              transform: [{translateY: -60}],
              width: '100%',

              alignItems: 'center',
            }}>
            <Text style={styles.error}>{error}</Text>
            <Text></Text>
          </View>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            color={MAIN_COLOR}
            size="large"
            style={{transform: [{translateY: -60}]}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 0,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    width: '90%',
  },
  buttonFont: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  error: {
    alignSelf: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.9,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {exitToAuthThunk})(MainShopMenu);
