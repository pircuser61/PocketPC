import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import HeaderForChooseShop from '../components/HeaderForChooseShop';
import {PocketAvailShops} from '../functions/PocketAvailShops';
import UserStore from '../mobx/UserStore';
import {setPodrazdThunk, exitToAuthThunk} from '../redux/reducer';

const NextShopMenu = observer(
  ({route, navigation, setPodrazdThunk, exitToAuthThunk, podrazd}) => {
    const {OPshop} = route.params;
    let isGroup = false;
    if (typeof OPshop.Group !== 'undefined') {
      isGroup = true;
    }

    const [render, startRender] = useState(false);

    function makeActionWithPodrazd(value) {
      setPodrazdThunk(value);
      UserStore.podrazd = value;
    }

    useEffect(() => {
      setTimeout(() => startRender(true), 100);
    }, []);

    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            width: '100%',
            height: 68,
            justifyContent: 'center',
            borderBottomColor: 'grey',
            marginHorizontal: 16,
          }}
          onPress={() => {
            if (podrazd.Id.length === 0) {
              if (isGroup) {
                if (
                  typeof item['Shop'] === 'object' &&
                  item['Shop'].length === 1
                ) {
                  makeActionWithPodrazd(item['Shop'][0].$);
                } else navigation.push('Details', {OPshop: item});
              } else makeActionWithPodrazd(item.$);
            } else {
              if (isGroup) {
                if (
                  typeof item['Shop'] === 'object' &&
                  item['Shop'].length === 1
                ) {
                  makeActionWithPodrazd(item['Shop'][0].$);
                  navigation.popToTop();
                } else navigation.push('NextChangeShop', {OPshop: item});
              } else {
                makeActionWithPodrazd(item.$);
                navigation.popToTop();
              }
            }
          }}>
          {isGroup ? (
            <>
              <Text style={{fontSize: 20, opacity: 0.87}}>
                {item['$']['Name']}
              </Text>
              <Text
                style={{fontSize: 14, opacity: 0.6, marginBottom: 10}}></Text>
            </>
          ) : (
            <>
              <Text style={{fontSize: 20, opacity: 0.87}}>
                {item['$']['Id']}
              </Text>
              <Text style={{fontSize: 14, opacity: 0.6, marginBottom: 10}}>
                {item['$']['Name']}
              </Text>
            </>
          )}
          <Divider />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{flex: 1}}>
        <HeaderForChooseShop
          title={OPshop.$.Id + ' ' + OPshop.$.Name}
          isSecond={true}
          navigation={navigation}
          exitToAuthThunk={exitToAuthThunk}
        />
        {render ? (
          OPshop.Shop || OPshop.Group ? (
            <FlatList
              data={OPshop.Shop || OPshop.Group}
              renderItem={renderItem}
              keyExtractor={(item, index) => item['$']['Id'] + index}
            />
          ) : (
            <Text>Нет доступа</Text>
          )
        ) : null}
      </View>
    );
  },
);

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {
  setPodrazdThunk,
  exitToAuthThunk,
})(NextShopMenu);
