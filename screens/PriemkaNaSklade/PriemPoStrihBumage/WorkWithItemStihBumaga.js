import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BotNavigation from '../PriemMestnyh/BotNavigation';
import {
  alertActions,
  TOGGLE_SCANNING,
  _strSPLITANDCOMPARE,
} from '../../../constants/funcrions';
import {connect} from 'react-redux';
import {PocketPrPda4sGet} from '../../../functions/PocketPrPda4sGet';
import {PocketPrPda4sSave} from '../../../functions/PocketPrPda4sSave';
import {PocketBarcodInfo} from '../../../functions/PocketBarcodInfo';
import {PocketKatInfo} from '../../../functions/PocketKatInfo';
import {TextInputMask} from 'react-native-masked-text';
import moment from 'moment';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import LoadingComponent from '../../../components/PriemPoStrihBumage/LoadingComponent';

const WorkWithItemStihBumaga = observer(props => {
  const {navigation, route, user} = props;
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    BarCod: '',
    CodGood: '',
    DOP: '',
    DateErr: '',
    DateWarn: '',
    IdNum: '',
    ListPal: '',
    ListQty: '',
    ListUpak: '',
    MonthLife: '',
    NoLabel: '',
    MarkReqd: 'no',
  });
  const {
    params = {
      BarCod: '',
      CodGood: '',
      IdNum: '',
      ListQty: '',
      NoLabel: '',
      artic: '',
    },
  } = route;
  const {
    BarCod = '',
    CodGood = '',
    IdNum = '',
    ListQty = '',
    NoLabel = '',
    artic = '',
  } = params;

  const [ListWithQty, setListWithQty] = useState([]);

  const _api = PriemMestnyhHook();

  const {barcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      if (!articool) {
        setArticool(barcode.data);
        GetInfoAboutCodGood(barcode.data);
      } else {
        setBarcode(barcode.data);
      }
    }
  }, [barcode]);

  const reducer = (accumulator, currentValue) =>
    Number(accumulator) + Number(currentValue);

  //.split(',').reduce(reducer)

  const saveItemInTradeSystem = (red = false) => {
    setLoading(true);
    PocketPrPda4sSave(
      NakladNayaStore.nakladnayaInfo.IdNum,
      item.IdNum,
      articool,
      barcodeLocal,
      NakladNayaStore.newListForEveryItem,
      DOP,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(r);
        if ((r.MarkReqd === 'yes' && !item.IdNum) || red) {
          navigation.navigate('WorkWithMarkirovkaStrihBumaga', {
            numNakl: NakladNayaStore.nakladnayaInfo.numNakl,
            IdNum: r.IdNum,
            qty: NakladNayaStore.newListForEveryItem
              .filter(r => r.checked)
              .filter(r => r.palletNumber !== '' && r.palletNumber !== '0')
              .map(r => r.qty)
              .reduce(reducer),
          });
          getInfoByIdNum(r.IdNum);
        } else {
          navigation.goBack();
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        alert(e);
      });
  };

  const getInfoByIdNum = IdNum => {
    PocketPrPda4sGet(
      NakladNayaStore.nakladnayaInfo.IdNum,
      IdNum,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(fullInfo => {
        console.log(fullInfo);
        setItem(fullInfo);

        (NakladNayaStore.newListForEveryItem = NakladNayaStore.cityList
          .filter(r => r.checked)
          .filter(r => r.palletNumber && r.palletNumber !== '0')
          .map((item, i) => {
            return {...item, qty: fullInfo.ListQty.split(',')[i]};
          })),
          setDOP(fullInfo.DOP);
        setLoading(false);
      })
      .catch(e => {
        alert(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    setItem({...item, IdNum, BarCod, CodGood});
    if (IdNum) {
      setLoading(true);
      setArticool(CodGood);
      setBarcode(BarCod);
      getInfoByIdNum(IdNum);
    } else {
      if (artic) {
        setArticool(artic);
        GetInfoAboutCodGood(artic);
      }
      setLoading(false);
      NakladNayaStore.newListForEveryItem = NakladNayaStore.cityList
        .filter(r => r.checked)
        .filter(r => r.palletNumber && r.palletNumber !== '0')
        .map((item, i) => {
          return {
            ...item,
            qty: ListQty.split(',')[i] ? ListQty.split(',')[i] : '',
            howManyNeed: ListQty.split(',')[i] ? ListQty.split(',')[i] : '0',
          };
        });
    }
  }, [IdNum]);

  useEffect(() => {
    return () => {
      NakladNayaStore.newListForEveryItem = [];
    };
  }, []);

  const [articool, setArticool] = useState('');
  const [barcodeLocal, setBarcode] = useState('');

  const GetInfoAboutBarCod = () => {
    PocketBarcodInfo(barcodeLocal, user.user.$['city.cod'])
      .then(r => {
        console.log(r);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const checkCurrentArticoolWithTSCodGood = (red = false) => {
    setLoading(true);
    PocketBarcodInfo(barcodeLocal, user.user.$['city.cod'])
      .then(r => {
        console.log(r);
        if (r.CodGood[0] === articool) {
          saveItemInTradeSystem(red);
        } else {
          if (articool === '' || articool === '0') {
            saveItemInTradeSystem(red);
          } else {
            setLoading(false);
            alert(
              'Баркод принадлежит другому товару ' +
                r.CodGood[0] +
                '\n' +
                'Наименование: ' +
                r.Name[0] +
                '\n' +
                'Подтвердите баркод!',
            );
          }
        }
      })
      .catch(e => {
        console.log(e);
        setLoading(false);

        alert(e);
      });
  };

  const [DOP, setDOP] = useState('');

  const GetInfoAboutCodGood = art => {
    setLoading(true);
    PocketKatInfo(
      art,
      NakladNayaStore.nakladnayaInfo.IdNum,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(r);
        setItem({
          ...item,
          ...r,
          CodGood: art,
        });
        setDOP('');
        setLoading(false);
      })
      .catch(e => {
        alert(e);
        setLoading(false);
      });
  };

  const rePlaceDate = (dateStr = '') => {
    let newArr = dateStr.split('/');
    return newArr[1] + '/' + newArr[0] + '/' + newArr[2];
  };

  useEffect(() => {
    if (item.DateWarn && item.DateErr && DOP.length === 8) {
      let d1 = moment(item.DateWarn, 'DD-MM-YY');
      let d2 = moment(DOP, 'DD-MM-YY');
      let d3 = moment(item.DateErr, 'DD-MM-YY');
      if (d1 > d2 && d2 > d3) {
        alertActions('Осталось менее 1/3 срока годности...');
      }
      if (d1 > d2 && d2 < d3) {
        alertActions('Срок годности истек...');
      }
    }
  }, [DOP]);

  return (
    <View style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <HeaderPriemka navigation={navigation} title={'Добавление товара'} />
          <View style={{flexDirection: 'row', margin: 16}}>
            <View style={{width: '40%'}}>
              <Text style={[styles.artandbcd1]}>Артикул: </Text>
              <TextInput
                style={styles.input1}
                onChangeText={text => {
                  setArticool(text);
                }}
                value={articool}
                placeholder="Введите артикул"
                keyboardType="numeric"
              />
            </View>
            <View style={{width: '40%'}}>
              <Text style={[styles.artandbcd1]}>Баркод: </Text>
              <TextInput
                style={styles.input1}
                onChangeText={text => {
                  setBarcode(text);
                }}
                value={barcodeLocal}
                placeholder="Введите баркод"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={{position: 'absolute', right: 0, padding: 8}}
              onPress={() => {
                setArticool('');
                setBarcode('');
              }}>
              <MaterialCommunityIcons name="close" size={28} />
            </TouchableOpacity>
          </View>
          {item.MarkReqd === 'yes' ? (
            <>
              <Divider />
              <TouchableOpacity
                onPress={() => {
                  checkCurrentArticoolWithTSCodGood(true);
                }}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 16,
                }}>
                <AntDesign name="exclamationcircleo" size={20} color="black" />
                <Text
                  style={{
                    fontSize: 14,
                    marginLeft: 16,
                    fontWeight: '100',
                    justifyContent: 'center',
                  }}>
                  Ввести маркировку
                </Text>

                <MaterialCommunityIcons
                  style={{position: 'absolute', right: 16}}
                  name={'chevron-right'}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </>
          ) : null}
          <Divider />
          {item.MonthLife !== '0' && item.MonthLife !== '' ? (
            <>
              <Divider />
              <View
                style={{
                  margin: 16,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{fontSize: 12}}>
                    Срок годности{' '}
                    <Text style={{fontWeight: 'bold'}}>
                      {item.MonthLife} месяцев
                    </Text>
                  </Text>
                  <Text style={{fontSize: 12}}>
                    Конец срока годности{' '}
                    <Text style={{fontWeight: 'bold'}}>{item.DateErr}</Text>
                  </Text>
                  <Text style={{fontSize: 12}}>
                    1/3 срока останется с{' '}
                    <Text style={{fontWeight: 'bold'}}>{item.DateWarn}</Text>
                  </Text>
                </View>
                <TextInputMask
                  placeholder={'ДД/ММ/ГГ'}
                  type={'datetime'}
                  options={{
                    format: 'DD/MM/YY',
                  }}
                  style={{
                    borderBottomWidth: 0.5,
                  }}
                  value={DOP}
                  onChangeText={text => {
                    setDOP(text);
                  }}
                />
              </View>
            </>
          ) : null}
        </View>
      </TouchableWithoutFeedback>

      <ScrollView>
        <Divider />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 16,
          }}>
          <Text style={styles.shortName}>Название объединения</Text>
          <Text style={styles.shortName}>Номер объединения</Text>
          <Text style={[styles.shortName, {width: '30%', textAlign: 'center'}]}>
            Номер паллеты
          </Text>

          <Text
            style={[styles.shortName, {width: '20%', marginHorizontal: 12}]}>
            Количество{' '}
          </Text>
        </View>
        <Divider />

        {NakladNayaStore.newListForEveryItem.map((r, i) => {
          return (
            <View key={i}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 16,
                }}>
                <Text style={styles.artandbcd}>{r.name[0]}</Text>
                <Text style={styles.artandbcd}>{r.cod_ob[0]}</Text>
                <Text
                  style={[
                    styles.artandbcd,
                    {width: '30%', textAlign: 'center'},
                  ]}>
                  {r.palletNumber}
                </Text>

                <TextInput
                  style={[styles.input, {width: '20%'}]}
                  onChangeText={text => {
                    NakladNayaStore.newListForEveryItem[i].qty = text;
                  }}
                  value={r.qty}
                  placeholder="Кол-во"
                  keyboardType="numeric"
                />
              </View>
              <Divider />
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        disabled={loading}
        style={{
          height: 48,
          justifyContent: 'center',
          zIndex: 100,
          backgroundColor: '#313C47',
          alignItems: 'center',
          width: '100%',
        }}
        onPress={() => {
          {
            articool === item.CodGood
              ? checkCurrentArticoolWithTSCodGood()
              : GetInfoAboutCodGood(articool);
          }
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          {articool === item.CodGood
            ? item.IdNum
              ? 'Изменить товар'
              : 'Добавить товар'
            : 'Получить данные о товаре'}
        </Text>
      </TouchableOpacity>
      {loading ? <LoadingComponent /> : null}
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(WorkWithItemStihBumaga);
const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 12,
    borderBottomWidth: 0.5,
    width: '30%',
  },
  artandbcd1: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 60,
  },
  artandbcd: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
  },
  shortName: {
    paddingVertical: 10,
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
  },
  input1: {
    borderBottomWidth: 0.4,
    width: '90%',
  },
});

/**
 *   <Divider />
          <Pressable
            onPress={() => {
              console.log(barcodeLocal);
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#313C47',
            }}>
            <Text
              style={{
                paddingVertical: 16,
                color: 'white',
                fontWeight: 'bold',
              }}>
              Проверить баркод
            </Text>
          </Pressable>



           <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 16,
            }}>
            <Text style={styles.artandbcd}>Артикул: </Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                setArticool(text);
              }}
              value={articool}
              placeholder="Введите артикул"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{position: 'absolute', right: 0, padding: 8}}
              onPress={() => {
                setArticool('');
                setBarcode('');
              }}>
              <MaterialCommunityIcons name="close" size={28} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 16,
            }}>
            <Text style={styles.artandbcd}>Баркод: </Text>
            <TextInput
              style={styles.input}
              onChangeText={text => {
                setBarcode(text);
              }}
              value={barcodeLocal}
              placeholder="Введите баркод"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 0,
                padding: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                GetInfoAboutCodGood();
              }}>
              <MaterialCommunityIcons name="sync" size={28} />
            </TouchableOpacity>
          </View>

           <Text style={styles.artandbcd1}>Баркод: </Text>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  setBarcode(text);
                }}
                value={barcodeLocal}
                placeholder="Введите баркод"
                keyboardType="numeric"
              />
 */
