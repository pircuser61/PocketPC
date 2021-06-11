import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DataWedgeIntents from 'react-native-datawedge-intents';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {PocketPrPda2} from '../../../functions/PocketPrPda2';
import {connect} from 'react-redux';
import {setPalletsListInPriemMestnyhTHUNK} from '../../../redux/reducer';
import {useFocusEffect} from '@react-navigation/native';
import {PocketBarcodInfo} from '../../../functions/PocketBarcodInfo';
import {PocketPrBarInfo} from '../../../functions/PocketPrBarInfo';
import {Button, Divider} from 'react-native-paper';
import TextFullInfoComponent from '../../../components/PriemkaNaSklade/PriemMestnyh/TextFullInfoComponent';
import {PocketPrPda2Save} from '../../../functions/PocketPrPda2Save';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import ModalChooseNN from '../../../components/PriemkaNaSklade/PriemMestnyh/Modal';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {TextInputMask} from 'react-native-masked-text';
import {PocketPrPda2Get} from '../../../functions/PocketPrPda2Get';
import {alertActions} from '../../../constants/funcrions';
import QtyElement from '../../../components/PriemkaNaSklade/PriemMestnyh/QtyElement';
enableScreens();
const WorkWithItemScreen = ({navigation, route, user}) => {
  let mounted = true;
  const _api = PriemMestnyhHook();
  const {barcode} = _api;
  const [cantFindBarcode, findBarcode] = useState(false);
  useEffect(() => {
    let current = new Date();

    barcode.data
      ? mounted &&
        setBarcode({
          data: barcode.data.replace(/\D+/g, ''),
          time: current.toLocaleTimeString(),
        })
      : null;
  }, [barcode]);

  useFocusEffect(
    React.useCallback(() => {
      mounted = true;
      return () => {
        mounted = false;
      };
    }, []),
  );

  const UpdateByIDNUM = idNum => {
    PocketPrPda2Get(idNum, user.user.$['city.cod'])
      .then(r => {
        mounted && findBarcode(false);
        mounted && setFullInfo(r);
        mounted && r.DOP ? setDOP(r.DOP) : null;
        mounted && setReady(true);
      })
      .catch(e => {
        if (e === 'Баркод не найден') {
          findBarcode(true);
          setFullInfo({
            ArhKat: [{Artic: ['-'], CodFirm: ['-']}],
            ArtName: '-',
            BarMeas: '-',
            KatMeas: '-',
            KatName: '-',
            ListUpak: '-',
            MonthLife: '-',
            CodGood: '',
            MarkReqd: '',
            DOP: '-',
            DateErr: '',
            DateWarn: '',
            QtyZak: '',
            QtyThisPr: '',
            QtyOtherPr: '',
            QtyThidDBS: '',
          });
        }
        alert(e);
      });
  };

  const [barcodeLocal, setBarcode] = useState({data: '', time: ''});
  const [NN, setNN] = useState('');
  const [Qty, setQty] = useState('');
  const [DOP, setDOP] = useState('');

  const setstat = () => {
    route.params.$.BarCod
      ? mounted && setBarcode({data: route.params.$.BarCod, time: ''})
      : null;
    route.params.$.NN ? mounted && setNN(route.params.$.NN) : null;
    route.params.$.Qty ? mounted && setQty(route.params.$.Qty) : null;
  };

  const [listOfNN, setListOfNN] = useState([]);

  useEffect(() => {
    route.params ? (route.params.$ ? setstat() : null) : null;
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    listOfNN
      ? listOfNN.length > 1
        ? mounted && setModalVisible(true)
        : null
      : null;
  }, [listOfNN]);

  useEffect(() => {
    listOfNN
      ? listOfNN.length === 1
        ? mounted && setNN(listOfNN[0])
        : null
      : null;
  }, [listOfNN]);

  const [fullInfo, setFullInfo] = useState({
    ArhKat: [{Artic: ['-'], CodFirm: ['-']}],
    ArtName: '-',
    BarMeas: '-',
    KatMeas: '-',
    KatName: '-',
    ListUpak: '-',
    MonthLife: '-',
    CodGood: '',
    MarkReqd: '',
    DOP: '',
    DateErr: '',
    DateWarn: '',
    QtyZak: '',
    QtyThisPr: '',
    QtyOtherPr: '',
    QtyThidDBS: '',
  });
  const screenHeight = Dimensions.get('window').height;

  const {MonthLife, DateWarn, DateErr} = fullInfo;

  let _strSPLITANDCOMPARE = str1 => {
    let newStr1 = '';
    if (str1[2] === '.') {
      let newstr = str1.split('.');
      newStr1 = `${newstr[1]}/${newstr[0]}/${newstr[2]}`;
    } else {
      let newstr = str1.split('/');
      newStr1 = `${newstr[1]}/${newstr[0]}/${newstr[2]}`;
    }
    return newStr1;
  };

  useEffect(() => {
    if (route.params.rejim === 'Добавление') {
      setReady(false);
      barcodeLocal.data
        ? PocketPrBarInfo(
            barcodeLocal.data,
            user.user.$['city.cod'],
            route.params.numNakl,
          )
            .then(r => {
              mounted && findBarcode(false);

              mounted && setFullInfo(r);
              r.ListNN !== ''
                ? mounted && setListOfNN(r.ListNN.split(','))
                : null;
              mounted && setReady(true);
            })
            .catch(e => {
              if (e === 'Баркод не найден') {
                findBarcode(true);

                setFullInfo({
                  ArhKat: [{Artic: ['-'], CodFirm: ['-']}],
                  ArtName: '',
                  BarMeas: '',
                  KatMeas: '',
                  KatName: '',
                  ListUpak: '',
                  MonthLife: '',
                  CodGood: '',
                  MarkReqd: '',
                  DOP: '',
                  DateErr: '',
                  DateWarn: '',
                  QtyZak: '',
                  QtyThisPr: '',
                  QtyOtherPr: '',
                  QtyThidDBS: '',
                });
              }
              alert(e);
              setReady(true);
            })
        : mounted && setReady(true);
    }
    if (route.params.rejim === 'Редактирование') {
      if (barcodeLocal.data && barcodeLocal.data !== route.params.$.BarCod) {
        console.log(
          'Баркод изменился\nBarcodeLocal:' +
            barcodeLocal.data +
            '\nroute.params.$.BarCod:' +
            route.params.$.BarCod,
        );
        setDOP('');
        setReady(false);
        PocketPrBarInfo(
          barcodeLocal.data,
          user.user.$['city.cod'],
          route.params.numNakl,
        )
          .then(r => {
            mounted && findBarcode(false);
            mounted && setFullInfo(r);
            r.ListNN !== ''
              ? mounted && setListOfNN(r.ListNN.split(','))
              : null;
            mounted && setReady(true);
          })
          .catch(e => {
            if (e === 'Баркод не найден') {
              findBarcode(true);
              setFullInfo({
                ArhKat: [{Artic: ['-'], CodFirm: ['-']}],
                ArtName: '-',
                BarMeas: '-',
                KatMeas: '-',
                KatName: '-',
                ListUpak: '-',
                MonthLife: '-',
                CodGood: '',
                MarkReqd: '',
                DOP: '',
                DateErr: '',
                DateWarn: '',
                QtyZak: '',
                QtyThisPr: '',
                QtyOtherPr: '',
                QtyThidDBS: '',
              });
            }
            alert(e);
            setReady(true);
          });
      } else UpdateByIDNUM(route.params.$.IdNum);
    }
  }, [barcodeLocal]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (DateWarn && DateErr && DOP.length === 8) {
      let d1 = new Date(_strSPLITANDCOMPARE(DateWarn));
      let d2 = new Date(_strSPLITANDCOMPARE(DOP));
      let d3 = new Date(_strSPLITANDCOMPARE(DateErr));

      if (d1 > d2 && d2 > d3) {
        alertActions('Осталось менее 1/3 срока годности...');
      }
      if (d1 > d2 && d2 < d3) {
        alertActions('Срок годности истек...');
      }
    }
  }, [DOP, DateWarn]);

  return (
    <TouchableWithoutFeedback style={{flex: 1}}>
      <>
        {!ready ? (
          <ActivityIndicator
            style={{position: 'absolute', alignSelf: 'center', top: 300}}
            size={'large'}
            color="#313C47"
          />
        ) : null}
        <ModalChooseNN
          setNN={setNN}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          listNN={listOfNN}
        />
        <HeaderPriemka
          navigation={navigation}
          title={route.params.rejim + ' товара'}
        />
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.barcode}>
              <Text style={{margin: 16, fontSize: 16, fontWeight: 'bold'}}>
                Баркод:
              </Text>
              <Text style={{fontSize: 16, marginLeft: 10}}>
                {barcodeLocal.data.length
                  ? barcodeLocal.data
                  : 'Сканируйте баркод'}
              </Text>
            </View>

            {(fullInfo.MonthLife !== '0' &&
              fullInfo.MonthLife !== '-' &&
              fullInfo.MonthLife) ||
            cantFindBarcode ||
            fullInfo.CodGood === '0' ||
            fullInfo.DOP ||
            (!barcodeLocal.data.length &&
              route.params.rejim === 'Редактирование' &&
              ready) ? (
              <>
                <Divider />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 16,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    Дата производства:{' '}
                  </Text>
                  <TextInputMask
                    placeholder={'ДД.ММ.ГГ'}
                    style={[styles.textInp, {textAlign: 'center'}]}
                    type={'datetime'}
                    options={{
                      format: 'DD.MM.YY',
                    }}
                    value={DOP}
                    onChangeText={text => {
                      setDOP(text);
                    }}
                  />
                </View>
              </>
            ) : null}
            {cantFindBarcode ||
            fullInfo.CodGood === '0' ||
            (!barcodeLocal.data.length &&
              route.params.rejim === 'Редактирование' &&
              ready) ? (
              <>
                <Divider />
                <TouchableOpacity
                  onPress={() => {
                    if (route.params.rejim === 'Редактирование') {
                      mounted && setReady(false);
                      PocketPrPda2Save(
                        NN,
                        barcodeLocal.data,
                        Qty,
                        route.params.palletNumber,
                        route.params.$.IdNum,
                        fullInfo.CodGood,
                        route.params.ParentId,
                        DOP,
                        user.user.$['city.cod'],
                      )
                        .then(r => {
                          {
                            UpdateByIDNUM(route.params.$.IdNum);
                            mounted && setReady(true);
                            navigation.navigate('WorkWithMarkirovka', {
                              numNakl: route.params.numNakl,
                              palletNumber: route.params.palletNumber,
                              IdNum: route.params.$.IdNum,
                              qty: Qty,
                              ParentId: route.params.ParentId,
                            });
                          }
                        })
                        .catch(e => {
                          alert(e);
                          mounted && setReady(true);
                        });
                    } else alert('Сначала добавьте товар');
                  }}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <AntDesign
                    name="exclamationcircleo"
                    size={20}
                    color="black"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 16,
                      fontWeight: '100',
                      justifyContent: 'center',
                    }}>
                    Все равно ввести маркировку!
                  </Text>
                  {route.params.rejim === 'Редактирование' ? (
                    <MaterialCommunityIcons
                      style={{position: 'absolute', right: 16}}
                      name={'chevron-right'}
                      size={20}
                      color="black"
                    />
                  ) : null}
                </TouchableOpacity>
              </>
            ) : null}
            {fullInfo.MarkReqd === 'true' ? (
              <>
                <Divider />
                <TouchableOpacity
                  onPress={() => {
                    if (route.params.rejim === 'Редактирование') {
                      mounted && setReady(false);
                      PocketPrPda2Save(
                        NN,
                        barcodeLocal.data,
                        Qty,
                        route.params.palletNumber,
                        route.params.$.IdNum,
                        fullInfo.CodGood,
                        route.params.ParentId,
                        DOP,
                        user.user.$['city.cod'],
                      )
                        .then(r => {
                          {
                            UpdateByIDNUM(route.params.$.IdNum);
                            mounted && setReady(true);
                            navigation.navigate('WorkWithMarkirovka', {
                              numNakl: route.params.numNakl,
                              palletNumber: route.params.palletNumber,
                              IdNum: route.params.$.IdNum,
                              qty: Qty,
                              ParentId: route.params.ParentId,
                            });
                          }
                        })
                        .catch(e => {
                          alert(e);
                          mounted && setReady(true);
                        });
                    } else alert('Сначала добавьте товар');
                  }}
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 16,
                  }}>
                  <AntDesign
                    name="exclamationcircleo"
                    size={20}
                    color="black"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 16,
                      fontWeight: '100',
                      justifyContent: 'center',
                    }}>
                    Требуется маркировка
                  </Text>
                  {route.params.rejim === 'Редактирование' ? (
                    <MaterialCommunityIcons
                      style={{position: 'absolute', right: 16}}
                      name={'chevron-right'}
                      size={20}
                      color="black"
                    />
                  ) : null}
                </TouchableOpacity>
              </>
            ) : null}
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
                marginVertical: 8,
              }}>
              <QtyElement keyName={'В заказе:'} valueName={fullInfo.QtyZak} />
              <QtyElement keyName={'DBS:'} valueName={fullInfo.QtyThidDBS} />
              <QtyElement
                keyName={'Прих. накл.:'}
                valueName={fullInfo.QtyThisPr}
              />
              <QtyElement
                keyName={'Др. накл.:'}
                valueName={fullInfo.QtyOtherPr}
              />
            </View>
            <Divider />
            <View style={{paddingBottom: 120}}>
              <TextFullInfoComponent
                title={'Код товара'}
                value={fullInfo.CodGood}
              />
              <TextFullInfoComponent
                title={'Наименование'}
                value={fullInfo.KatName}
              />
              <TextFullInfoComponent
                title={'Eд. изм (бар)'}
                value={fullInfo.BarMeas}
              />
              <TextFullInfoComponent
                title={'Eд. изм (кат)'}
                value={fullInfo.KatMeas}
              />
              <TextFullInfoComponent
                title={'В упаковке'}
                value={fullInfo.ListUpak}
              />

              <TextFullInfoComponent
                title={'Годен'}
                value={fullInfo.MonthLife}
              />

              <PostavshikAndArticool first={'Поставщик'} second={'Артикул'} />
              {fullInfo.ArhKat[0].Artic[0] !== '-'
                ? fullInfo.ArhKat.map((r, i) => {
                    return (
                      <PostavshikAndArticool
                        key={i.toString() + 'fdsfsdhfsdfj'}
                        first={r.CodFirm[0]}
                        second={r.Artic[0]}
                      />
                    );
                  })
                : null}
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            height: 80,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            justifyContent: 'center',
            backgroundColor: '#D1D1D1',
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
          }}>
          <View style={styles.fooo}>
            <View style={styles.inputForm}>
              <Text style={[styles.formText]}>NN:</Text>
              <TextInput
                editable={ready}
                style={[styles.textInp, {}]}
                keyboardType={'number-pad'}
                placeholder="NN"
                value={NN}
                onChangeText={text => setNN(text.replace(/\D+/g, ''))}
              />
            </View>
            <View style={styles.inputForm}>
              <Text style={[styles.formText]}>Количество:</Text>
              <TextInput
                editable={ready}
                style={[styles.textInp, {width: 100}]}
                keyboardType={'number-pad'}
                placeholder="Количество"
                value={Qty}
                onChangeText={text => {
                  if (text.replace(/\D+/g, '').length > Qty.length) {
                    if (
                      Number(text.replace(/\D+/g, '')) > Number(fullInfo.QtyZak)
                    ) {
                      alertActions('Указаное кол-во больше, чем в заказе');
                    }
                  }
                  if (fullInfo.ListUpak) {
                    setQty(text.replaceAll(',', '.'));
                  } else setQty(text.replace(/\D+/g, ''));
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.circle}></View>
        <TouchableOpacity
          disabled={!ready}
          style={[styles.circle, {backgroundColor: ready ? '#313C47' : null}]}
          onPress={() => {
            mounted && setReady(false);
            PocketPrPda2Save(
              NN,
              barcodeLocal.data,
              Qty,
              route.params.palletNumber,
              route.params.$.IdNum,
              fullInfo.CodGood,
              route.params.ParentId,
              DOP,
              user.user.$['city.cod'],
            )
              .then(r => {
                if (
                  fullInfo.MarkReqd === 'true' &&
                  route.params.rejim === 'Добавление'
                ) {
                  mounted && setReady(true);
                  if (Qty != 0 || Qty) {
                    navigation.navigate('WorkWithMarkirovka', {
                      numNakl: route.params.numNakl,
                      palletNumber: route.params.palletNumber,
                      IdNum: r['IdNum'][0],
                      qty: Qty,
                      ParentId: route.params.ParentId,
                    });
                  }
                } else {
                  mounted && setReady(true);
                }
                if (Qty == 0 || Qty == '' || !Qty) {
                  mounted && setQty('0');
                }
                if (NN == '' || NN == 0 || !NN) {
                  mounted && setNN('0');
                }
                navigation.setParams({
                  ...route.params,
                  rejim: 'Редактирование',
                  $: {...route.params.$, IdNum: r['IdNum'][0]},
                });
                UpdateByIDNUM(r['IdNum'][0]);
                if (
                  fullInfo.MarkReqd === 'false' ||
                  route.params.rejim === 'Редактирование'
                ) {
                  navigation.goBack();
                }
              })
              .catch(e => {
                alert(e);
                mounted && setReady(true);
              });
            //navigation.goBack();
          }}>
          <MaterialIcons
            name="add-task"
            size={24}
            color={ready ? '#f2f2f2' : '#313C47'}
          />
        </TouchableOpacity>
      </>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

const styles = StyleSheet.create({
  circle: {
    height: 80,
    alignItems: 'center',
    width: 80,
    borderRadius: 0,
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#D1D1D1',
    //alignSelf: 'center',
    right: 0,
    bottom: 0,
    borderWidth: 0,
    borderColor: '#f3f4f1',
  },
  formText1: {
    marginHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formText: {
    fontSize: 10,
    //fontWeight: 'bold',
    color: 'black',
    opacity: 0.5,
  },
  inputForm: {
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  textInp: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#f3f4f1',
    borderRadius: 4,
    width: 100,
    fontSize: 16,
  },
  barcode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fooo: {
    flexDirection: 'row',
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
});

export default connect(mapStateToProps, {setPalletsListInPriemMestnyhTHUNK})(
  WorkWithItemScreen,
);
