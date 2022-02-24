import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  RefreshControl,
  DeviceEventEmitter,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {Divider} from 'react-native-paper';
import {PocketPrPda2} from '../../../functions/PocketPrPda2';
import {useFocusEffect} from '@react-navigation/native';
import 'react-native-gesture-handler';
import BotNavigation from './BotNavigation';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {
  alertActions,
  SCREEN_HEIGHT,
  TOGGLE_SCANNING,
  wait,
} from '../../../constants/funcrions';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkWithItemsInPallete = ({navigation, route, user}) => {
  let mounted = true;

  const _api = PriemMestnyhHook();
  const {barcode} = _api;
  const [checked, setChecked] = useState(false);
  const [list, setList] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const _getListFromService = () => {
    PocketPrPda2(
      route.params.palletNumber,
      route.params.IdNum,
      route.params.podrazdToGo,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        mounted && setList(r.row);
        mounted && setRefreshing(false);
        mounted && setChecked(true);
      })
      .catch(e => {
        mounted = false;
        alert(e);
        console.log(
          '\x1b[31m',
          `\nПроизошла ошибка в функции PocketPrPda2\n${e}\n<----------------------------------------------------------------------->`,
          '\x1b[0m',
        );
        mounted && alertActions(e);
        navigation.goBack();
        mounted && setRefreshing(false);
        mounted && setChecked(true);
      });
  };

  const onRefresh = React.useCallback(() => {
    mounted && setRefreshing(true);
    wait(100).then(() => {
      _getListFromService();
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log(route.params);
      mounted = true;
      _getListFromService();

      return () => {
        mounted = false;
      };
    }, []),
  );

  useEffect(() => {
    barcode.data
      ? navigation.navigate('WorkWithItemScreen', {
          ...route.params,
          $: {BarCod: barcode.data, idNum: ''},
          rejim: 'Добавление',
        })
      : null;
  }, [barcode]);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka
        navigation={navigation}
        title={`Номер накладной: ${route.params.numNakl}\nНомер паллеты: ${route.params.palletNumber}`}
      />
      <View>
        <Text
          style={{
            fontSize: 18,
            alignSelf: 'center',
            marginVertical: 8,
            fontWeight: 'bold',
          }}>
          Товары в паллете
        </Text>
      </View>

      <Divider />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 8,
          marginHorizontal: 4,
        }}>
        <View style={[styles.filter, {borderEndWidth: 1}]}>
          <Text style={{fontWeight: 'bold'}}>NN</Text>
        </View>
        <View style={[styles.filter, {borderEndWidth: 1, width: '60%'}]}>
          <Text style={{fontWeight: 'bold'}}>Баркод</Text>
        </View>

        <View style={styles.filter}>
          <Text style={{fontWeight: 'bold'}}>Кол-во</Text>
        </View>
      </View>
      <Divider />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {typeof list === 'object' ? (
          list.map((r, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  Vibration.vibrate(100);
                  navigation.navigate('WorkWithItemScreen', {
                    ...r,
                    palletNumber: route.params.palletNumber,
                    numNakl: route.params.numNakl,
                    rejim: 'Редактирование',
                    ParentId: route.params.ParentId,
                    IdNum: route.params.IdNum,
                  });
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingVertical: 16,
                  borderRadius: 4,
                  marginVertical: 4,
                  backgroundColor: 'grey',
                  marginHorizontal: 4,
                }}>
                <View style={[styles.filter, {borderEndWidth: 1}]}>
                  <Text style={styles.inTouchText}>{r.$.NN}</Text>
                </View>

                <View
                  style={[styles.filter, {borderEndWidth: 1, width: '60%'}]}>
                  <Text style={[styles.inTouchText, {textAlign: 'center'}]}>
                    {r.$.BarCod ? r.$.BarCod : '---'}
                  </Text>
                </View>

                <View style={styles.filter}>
                  <Text style={styles.inTouchText}>{r.$.Qty}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : checked ? (
          <View
            style={{
              alignSelf: 'center',
              opacity: 0.5,
              height: SCREEN_HEIGHT * 0.6,

              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name={'format-list-bulleted'}
              style={{alignSelf: 'center'}}
              size={30}
            />
            <Text style={{fontSize: 14, alignSelf: 'center', margin: 2}}>
              Список пуст
            </Text>
          </View>
        ) : (
          <ActivityIndicator style={{marginTop: 140}} color="#313C47" />
        )}
        <View style={{height: 80, width: '100%'}}></View>
      </ScrollView>

      <Divider />
      <BotNavigation
        leftOnPress={TOGGLE_SCANNING}
        leftName={'Вкл/выкл сканер'}
        rightName={'Добавить товар'}
        rightOnPress={() => {
          navigation.navigate('WorkWithItemScreen', {
            IdNum: route.params.IdNum,
            ParentId: route.params.ParentId,
            numNakl: route.params.numNakl,
            palletNumber: route.params.palletNumber,
            rejim: 'Добавление',
            $: {idNum: ''},
          });
        }}
      />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(WorkWithItemsInPallete);

const styles = StyleSheet.create({
  filter: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inTouchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

/**
 *      <View style={[styles.filter, {borderEndWidth: 1, width: '30%'}]}>
          <Text style={{fontWeight: 'bold'}}>IdNum</Text>
        </View>
 *  <View
                  style={[styles.filter, {borderEndWidth: 1, width: '30%'}]}>
                  <Text>{r.$.IdNum}</Text>
                </View>
 */
