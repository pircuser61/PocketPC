import {useFocusEffect} from '@react-navigation/core';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Card, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';

import {connect} from 'react-redux';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {PocketPrPda4s} from '../../../functions/PocketPrPda4s';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import BotNavigation from '../PriemMestnyh/BotNavigation';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

const Item = props => {
  const {item, navigation} = props;
  const {
    BarCod = '',
    CodGood = '',
    IdNum = '',
    ListQty = '',
    NoLabel = '',
  } = item.$;
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        height: 80,
        flexDirection: 'row',
        borderBottomWidth: 0.25,
        borderBottomColor: 'grey',
      }}
      onPress={() => {
        navigation.navigate('WorkWithItemStihBumaga', {
          BarCod,
          CodGood,
          IdNum,
          ListQty,
          NoLabel,
        });
      }}>
      <View style={{width: '34%', marginLeft: 16}}>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          <Text style={{fontSize: 10, width: 30}}>код т.</Text>{' '}
          {CodGood ? CodGood : '-'}
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 14}}>
          <Text style={{fontSize: 10}}>бкд. </Text> {'  '}
          {BarCod ? BarCod : '-'}
        </Text>
      </View>
      <View style={{width: '60%'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            marginHorizontal: 24,
            textAlign: 'center',
          }}>
          кол-во: {ListQty}
        </Text>
      </View>

      <Icon
        name={'chevron-right'}
        size={20}
        style={{padding: 16, position: 'absolute', right: 0}}
      />
    </TouchableOpacity>
  );
};

const ItemStrihList = observer(props => {
  let mounted = true;
  const _api = PriemMestnyhHook();
  const {barcode} = _api;

  const {navigation, user} = props;
  const [itemsList, setItemsList] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  const getList = () => {
    setChecked(false);
    PocketPrPda4s(
      NakladNayaStore.nakladnayaInfo.IdNum,
      NakladNayaStore.cityList.filter(r => r.checked),
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(r);
        mounted && setItemsList(r);
        setRefreshing(false);
        setChecked(true);
      })
      .catch(e => {
        alert(e);
        setRefreshing(false);
        navigation.goBack();
      });
  };

  function _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.FULL:
        return <Item item={data} {...props} />;
      default:
        return null;
    }
  }

  const renderItem = ({item}) => (
    <>
      <Item item={item} {...props} />
      <Divider />
    </>
  );
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(itemsList);
  useFocusEffect(
    React.useCallback(() => {
      console.log(mounted);
      getList();

      return () => {
        console.log('yshel');
        setChecked(false);
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  let {width} = Dimensions.get('window');

  const _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FULL:
          dim.width = width;
          dim.height = 80;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  useEffect(() => {
    if (barcode.data) {
      navigation.navigate('WorkWithItemStihBumaga', {
        artic: barcode.data,
      });
    }
  }, [barcode]);

  const [checked, setChecked] = useState(false);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka navigation={navigation} title={'Спецификация паллет'} />
      <Text style={{margin: 16, fontSize: 14, fontWeight: 'bold'}}>
        Выбранные объединения:{' '}
        {NakladNayaStore.cityList
          .filter(r => r.checked && r.palletNumber && r.palletNumber !== '0')
          .map((r, i) => {
            if (
              i ===
              NakladNayaStore.cityList
                .filter(r => r.checked)
                .filter(r => r.palletNumber && r.palletNumber !== '0').length -
                1
            ) {
              return r.cod_ob[0] + ';';
            }
            return r.cod_ob[0] + ', ';
          })}
      </Text>
      <Divider />
      <View style={{alignItems: 'center', height: 40, flexDirection: 'row'}}>
        <View style={{width: '34%', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 12}}>
            Код товара/бкд.
          </Text>
        </View>
        <View style={{width: '60%'}}>
          <Text style={{fontWeight: 'bold', fontSize: 12, textAlign: 'center'}}>
            Количество по объединениям
          </Text>
        </View>
      </View>
      <Divider />
      {checked ? (
        itemsList.length ? (
          <RecyclerListView
            style={{marginBottom: 48}}
            layoutProvider={_layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={_rowRenderer}
            scrollViewProps={{
              refreshing: refreshing,
              refreshControl: (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ),
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 48,
            }}>
            <AntDesign name={'bars'} size={30} color="black" />
            <Text>Список пуст</Text>
          </View>
        )
      ) : (
        <ActivityIndicator style={{marginTop: 140}} color="#313C47" />
      )}
      <TouchableOpacity
        style={{
          height: 48,
          justifyContent: 'center',
          zIndex: 1000,
          backgroundColor: '#313C47',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        onPress={() => {
          navigation.navigate('WorkWithItemStihBumaga');
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Добавить товар
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#313C47',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(ItemStrihList);

/*
* NakladNayaStore.nakladnayaInfo.IdNum,
            NakladNayaStore.cityList.filter(r => r.checked),
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod']
 
  {itemsList.length ? (
          itemsList.map((r, i) => {
            const {
              BarCod = '',
              CodGood = '',
              IdNum = '',
              ListQty = '',
              NoLabel = '',
            } = r.$;
            return (
              <Pressable key={i}>
                <Card style={{justifyContent: 'center'}}>
                  <Card.Title
                    title={'Баркод: ' + BarCod}
                    subtitle={'Код товара' + CodGood}
                  />
                  <Text>{ListQty}</Text>
                </Card>
              </Pressable>
            );
          })
        ) : (
          <Text>Список пуст</Text>
        )}


 <FlatList
        renderItem={renderItem}
        data={itemsList}
        keyExtractor={(r, i) => i.toString()}
        ItemSeparatorComponent={() => <Divider />}
        style={{marginBottom: 48}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: Dimensions.get('screen').width,
              }}>
              <Icon
                name={'format-list-bulleted'}
                style={{alignSelf: 'center'}}
                size={30}
              />
              <Text>Список пуст</Text>
            </View>
          );
        }}
      />

            */

/**
       *   <ScrollView>
        {itemsList.map((r, index) => {
          return <Item item={r} key={index} {...props} />;
        })}
      </ScrollView>
       */
