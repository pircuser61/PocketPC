import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import InputField from '../../../components/Perepalechivanie/InputField';
import ItemInParams from '../../../components/Perepalechivanie/ItemInParams';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {PocketPerepalKatInfo} from '../../../functions/PocketPerepalKatInfo';
import {PocketPerepalPalTo} from '../../../functions/PocketPerepalPalTo';
import {PocketPerepalSave} from '../../../functions/PocketPerepalSave';
import PerepalechivanieStore from '../../../mobx/PerepalechivanieStore';

const PerepalechItem = observer(props => {
  const {user, navigation, route} = props;
  const {params} = route;
  const {mode = {name: 'Добавление', isAdd: true}} = params;
  const _api = PriemMestnyhHook();
  const [loading, setLoading] = useState(false);
  const {barcode, setBarcode} = _api;

  const getListWhereTOGO = paramCodGood => {
    PocketPerepalPalTo(
      PerepalechivanieStore.parrentId,
      PerepalechivanieStore.numpalFrom,
      paramCodGood,
      true,
      PerepalechivanieStore.palletsList,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        if (mode.name === 'Добавление') {
          PerepalechivanieStore.choseQtyList = r.map(item => ({
            $: {...item.$, Qty: ''},
          }));
        } else {
          PerepalechivanieStore.choseQtyList = r;
        }
        //console.log(r);
      })
      .catch(e => {
        alertActions(e);
        //setRefreshing(false);
      });
  };

  const [CodGood, setCodGood] = useState('');
  const [BarCode, setBarCode] = useState('');

  useEffect(() => {
    if (barcode.data) {
      if (!CodGood) {
        setCodGood(barcode.data);
        getCodGoodInfo(barcode.data);
        setBarcode({data: '', time: '', type: ''});
      } else {
        setBarCode(barcode.data);
        setBarcode({data: '', time: '', type: ''});
      }
    }
  }, [barcode, CodGood, BarCode]);

  // useEffect(() => {
  //   PerepalechivanieStore.choseQtyList = PerepalechivanieStore.palletsList
  //     .filter(r => r.palletNumber)
  //     .map(r => ({...r, qty: ''}));
  // }, []);

  const getCodGoodInfo = codGood => {
    PocketPerepalKatInfo(
      PerepalechivanieStore.parrentId,
      PerepalechivanieStore.numpalFrom,
      codGood,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        PerepalechivanieStore.itemInfo = r;
        getListWhereTOGO(codGood);
      })
      .catch(e => {
        alertActions(e);
      });
  };

  const getShopName = (sas, namemaxidom) => {
    return sas.filter(r => r.palletNumber === namemaxidom)[0]?.$.CodShop;
  };

  useEffect(() => {
    setCodGood(params.CodGood);
    if (params.CodGood) {
      getCodGoodInfo(params.CodGood);
    }

    return () => {
      PerepalechivanieStore.exitFromWorkWithItemNeworEdit();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={mode.name + ' товара'} />
      <ScrollView style={{marginBottom: 54}}>
        <View style={{paddingHorizontal: 16}}>
          <ItemInParams
            left={'Код товара:'}
            right={CodGood ? CodGood : 'Сканируйте код товара'}
            needIcon={CodGood && mode.name !== 'Редактирование' ? true : false}
            loading={false}
            onIconPress={() => {
              setCodGood('');
            }}
          />
          <ItemInParams
            left={'Баркод:'}
            right={BarCode ? BarCode : 'Сканируйте баркод'}
            needIcon={BarCode ? true : false}
            loading={false}
            onIconPress={() => {
              setBarCode('');
            }}
          />
          <ItemInParams
            left={'Артикул:'}
            right={PerepalechivanieStore.itemInfo.ArtName}
          />
          <ItemInParams
            left={'Наименование:'}
            right={PerepalechivanieStore.itemInfo.KatName}
          />
          <ItemInParams
            left={'Требуется:'}
            right={PerepalechivanieStore.itemInfo.QtyReqd}
          />
          <ItemInParams
            left={'Уже добавлено:'}
            right={PerepalechivanieStore.itemInfo.QtyThisDbsood}
          />
          <ItemInParams
            left={'В палетте:'}
            right={PerepalechivanieStore.itemInfo.QtyPal}
          />
          <ItemInParams
            left={'В другом зак.:'}
            right={PerepalechivanieStore.itemInfo.QtyOtherZnp}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                paddingVertical: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {PerepalechivanieStore.choseQtyList.length
                ? 'Укажите количество'
                : CodGood
                ? 'Товар в выбранные паллеты не едет'
                : 'Сканируйте код товара, чтобы указать количество'}
            </Text>
          </View>
          <Divider />
          {PerepalechivanieStore.choseQtyList.length
            ? PerepalechivanieStore.choseQtyList.map(
                (
                  r = {$: {CodGood: '', NumMax: '', NumPalTo: '', Qty: ''}},
                  index,
                ) => {
                  return (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 16,
                          //paddingRight: needIcon ? 40 : 0,
                        }}>
                        <Text style={styles.leftText}>М-{r.$.NumMax}</Text>
                        <Text style={styles.leftText}>{r.$.NumPalTo}</Text>
                        {getShopName(
                          PerepalechivanieStore.palletsList,
                          r.$.NumPalTo,
                        ) ? (
                          <Text style={styles.leftText}>
                            {getShopName(
                              PerepalechivanieStore.palletsList,
                              r.$.NumPalTo,
                            )}
                          </Text>
                        ) : null}

                        <TextInput
                          style={[styles.palletInputStyle, {width: 80}]}
                          keyboardType="numeric"
                          value={
                            PerepalechivanieStore.choseQtyList[index].$.Qty
                          }
                          onChangeText={text =>
                            (PerepalechivanieStore.choseQtyList[
                              index
                            ].$.Qty = text)
                          }
                          //value={value}
                        />
                      </View>
                      <Divider />
                    </View>
                  );
                },
              )
            : null}
        </View>

        <View style={{height: 54}} />
      </ScrollView>
      <ButtonBot
        disabled={loading}
        title={'Готово'}
        onPress={() => {
          setLoading(true);
          PocketPerepalSave(
            PerepalechivanieStore.parrentId,
            PerepalechivanieStore.numpalFrom,
            CodGood,
            BarCode,
            mode.name === 'Добавление' ? 'true' : 'false',
            PerepalechivanieStore.choseQtyList,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              setLoading(false);
              navigation.goBack();
            })
            .catch(e => {
              alertActions(e);
              setLoading(false);
            });
        }}
      />
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(PerepalechItem);

const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
  textInputField: {
    justifyContent: 'center',
  },
  palletInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
  rightText: {width: 200, textAlign: 'right'},
  leftText: {
    fontWeight: 'bold',
  },
});

/**
 * PocketPerepalSave(
      PerepalechivanieStore.parrentId,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(r);
      })
      .catch(e => {
        console.log(e);
      });
 */
