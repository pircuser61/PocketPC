import {action} from 'mobx';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {Divider, ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import HeaderForChooseShop from '../components/HeaderForChooseShop';
import {PocketAvailShops} from '../functions/PocketAvailShops';
import {exitToAuthThunk} from '../redux/reducer';

const MainShopMenu = ({navigation, route, exitToAuthThunk, podrazd, user}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    PocketAvailShops(user.user.TokenData[0].$.UserUID, user.user.$['city.cod'])
      .then(r => {
        setList(r);
      })
      .catch(e => {
        alert(e);
        setList([]);
      });
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
      {list.length ? (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item['$']['Id']}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={'#313C47'} size="large" />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {exitToAuthThunk})(MainShopMenu);
