import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DataWedgeIntents from 'react-native-datawedge-intents';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {PocketPrPda2} from '../../../functions/PocketPrPda2';
import {connect} from 'react-redux';
import {Divider} from 'react-native-paper';
import {setPalletsListInPriemMestnyhTHUNK} from '../../../redux/reducer';
import {useFocusEffect} from '@react-navigation/native';
import BotNavigation from './BotNavigation';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
import InputField from '../../../components/Perepalechivanie/InputField';

const WorkWithPallete = ({
  navigation,
  route,
  palletsInWork,
  setPalletsListInPriemMestnyhTHUNK,
}) => {
  const [palletNumber, setPalletNumber] = useState('');
  const _api = PriemMestnyhHook();
  const {barcode} = _api;
  const _podrRef = useRef(null);

  useEffect(() => {
    barcode.data
      ? setPalletsListInPriemMestnyhTHUNK([
          {data: barcode.data.replace(/\D+/g, ''), time: barcode.time},
          ...palletsInWork,
        ])
      : null;
    barcode.data
      ? navigation.navigate('WorkWithItemsInPallete', {
          ...route.params,
          palletNumber: barcode.data.replace(/\D+/g, ''),
        })
      : null;
  }, [barcode]);

  useEffect(() => {
    return () => {
      setPalletsListInPriemMestnyhTHUNK([]);
    };
  }, []);

  const scrollViewRef = useRef();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <HeaderPriemka
          navigation={navigation}
          title={'Номер накладной: ' + route.params.numNakl}
          accept={true}
        />
        <View style={{flex: 1}}>
          <InputField
            innerRef={_podrRef}
            placeholder={'Введите номер паллеты'}
            value={palletNumber}
            keyboardType="numeric"
            onSubmit={() => {
              if (!palletNumber) {
                alertActions('Не указан номер паллеты');
                return;
              }
              let current = new Date();
              setPalletsListInPriemMestnyhTHUNK([
                {data: palletNumber, time: current.toLocaleTimeString()},
                ...palletsInWork,
              ]);
              navigation.navigate('WorkWithItemsInPallete', {
                ...route.params,
                palletNumber: palletNumber,
              });
            }}
            isTextInput={true}
            iconName={'barcode-scan'}
            onIconPress={TOGGLE_SCANNING}
            title={'Номер паллеты'}
            setValue={txt => {
              setPalletNumber(txt);
            }}
          />

          <Divider style={{marginVertical: 16}} />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Дата обращения
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                Номер паллеты
              </Text>
            </View>
          </View>
          <Divider />
          <ScrollView
            style={{
              marginBottom: 60,
              margin: 16,
              borderRadius: 8,
            }}>
            {palletsInWork.length ? (
              palletsInWork.map((r, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('WorkWithItemsInPallete', {
                        ...route.params,
                        palletNumber: r.data,
                      });
                    }}
                    key={i}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      paddingVertical: 16,
                      borderRadius: 4,
                      marginVertical: 4,
                      backgroundColor: 'grey',
                      marginHorizontal: 4,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-around',
                        marginVertical: 0,
                      }}>
                      <View
                        style={{
                          width: '50%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 16}}>{r.time}</Text>
                      </View>
                      <View
                        style={{
                          width: '50%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: 16}}>{r.data}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{alignSelf: 'center', marginTop: 100, opacity: 0.5}}>
                <MaterialCommunityIcons
                  name={'format-list-bulleted'}
                  style={{alignSelf: 'center'}}
                  size={30}
                />
                <Text style={{fontSize: 14, alignSelf: 'center', margin: 2}}>
                  Список пуст
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <BotNavigation
          leftName={'Вкл/выкл сканер'}
          rightName={'Далее'}
          leftOnPress={TOGGLE_SCANNING}
          rightOnPress={() => {
            if (!palletNumber) {
              alertActions('Не указан номер паллеты');
              return;
            }
            let current = new Date();
            setPalletsListInPriemMestnyhTHUNK([
              {data: palletNumber, time: current.toLocaleTimeString()},
              ...palletsInWork,
            ]);
            navigation.navigate('WorkWithItemsInPallete', {
              ...route.params,
              palletNumber: palletNumber,
            });
          }}
        />
      </>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => {
  return {
    palletsInWork: state.palletsInWork,
  };
};

export default connect(mapStateToProps, {setPalletsListInPriemMestnyhTHUNK})(
  WorkWithPallete,
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
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
    borderRadius: 8,
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
});

/**
 *   <Text style={{fontSize: 20, margin: 16}}>Введите номер паллеты:</Text>
          <View style={{justifyContent: 'center'}}>
            <TextInput
              ref={_podrRef}
              style={{
                height: 56,
                borderColor: 'gray',
                borderWidth: 1,
                marginLeft: 16,
                marginRight: 70,
                backgroundColor: '#D1D1D1',
                paddingLeft: 16,
                borderRadius: 4,
              }}
              keyboardType="numeric"
              onChangeText={text => setPalletNumber(text)}
              value={palletNumber}
            />
            <TouchableOpacity
              style={{position: 'absolute', right: 4, padding: 20}}
              onPress={TOGGLE_SCANNING}>
              <MaterialCommunityIcons name="barcode-scan" size={28} />
            </TouchableOpacity>
          </View>
 */
