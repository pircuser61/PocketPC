import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {PocketProvperGoodsList} from '../../functions/PocketProvperGoodsList';
import UserStore from '../../mobx/UserStore';
import {ProverkaNakladnyhNavProps, ProvperGoodsRow} from '../../types/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import ProverkaNakladnyhStore from '../../mobx/ProverkaNakladnyhStore';
import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  timeout,
} from '../../constants/funcrions';
import {PocketProvperGoodsCreate} from '../../functions/PocketProvperGoodsCreate';
import Feather from 'react-native-vector-icons/Feather';
import ChangeGoodQtyProverkaNakladnyh from '../../components/ProverkaNakladnyh/ChangeGoodQtyProverkaNakladnyh';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';

type Props = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'GoodsListScreenInProverka'
>;

const GoodsListScreenInProverka = observer((props: Props) => {
  const {NumNakl, NumProv} = props.route.params;

  const getIndexOfDoc = (array: ProvperGoodsRow[], numdoc: string) => {
    'worklet';
    let idnext = 0;
    let doc = null;
    array.map((r, i) => {
      if (r.CodGood === numdoc) {
        idnext = i;
        doc = r;
      }
    });
    return {idnext, doc};
  };

  const [loading, setloading] = useState(true);
  const [goodsList, setgoodsList] = useState<ProvperGoodsRow[]>([]);
  const [mode, setMode] = useState<'-1' | '0' | '1' | null>(null);
  const [currentItem, setcurrentItem] = useState<ProvperGoodsRow | null>(null);

  const listRef = useRef<any>();

  let mounted = true;

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      addGood(barcode.data);

      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const scrollToIndex = (index: number) => {
    listRef?.current?.scrollToIndex(index, true);
  };

  const addGood = async (bcd = '', isSecondScreen = false) => {
    try {
      setloading(true);
      const response = await PocketProvperGoodsCreate({
        City: UserStore.user?.['city.cod'],
        Type: ProverkaNakladnyhStore.Type,
        UID: UserStore.user?.UserUID,
        BarCod: bcd,
        NumNakl: props.route.params.NumNakl,
        NumProv: props.route.params.NumProv,
      });

      setcurrentItem(response);

      let found = false;

      let newList = goodsList.map((r, i) => {
        if (r.CodGood === response.CodGood) {
          found = true;
          return response;
        } else return r;
      });

      if (found === false) {
        newList = [...newList, response].sort(
          (a, b) => Number(a.CodGood) - Number(b.CodGood),
        );
      }

      //TODO:Добавить прокрутку

      setgoodsList(newList);
      const nextIndex = getIndexOfDoc(newList, response.CodGood);
      await timeout(150);
      if (nextIndex.idnext) {
        scrollToIndex(nextIndex.idnext);
      }
    } catch (error) {
      if (isSecondScreen) {
        throw error;
      } else {
        if (mounted) alertActions(error);
      }
    } finally {
      setloading(false);
    }
  };

  const plusFunction = React.useCallback(
    (item: ProvperGoodsRow) => {
      setcurrentItem(item);

      setMode('1');
    },
    [mode],
  );

  const minusFunction = React.useCallback(
    (item: ProvperGoodsRow) => {
      setcurrentItem(item);

      setMode('-1');
    },
    [mode],
  );

  const changeQtyFunction = React.useCallback(
    (item: ProvperGoodsRow) => {
      setcurrentItem(item);
      setMode('0');
    },
    [mode],
  );

  const goToAddGood = () => {
    props.navigation.navigate('AddGoodsInNakladnayaScreen', {
      action: str => addGood(str, true),
      title: 'Добавление товара',
      inputtitle: 'Баркод',
    });
  };

  const changeQty = (item: {IdNum: string; Qty: string}) => {
    const newList = goodsList.map(r => {
      if (r.IdNum === item.IdNum) {
        return {...r, QtyFact: item.Qty};
      } else return r;
    });
    setgoodsList(newList);
  };

  const getList = useCallback(
    async (CheckShipment?: boolean) => {
      try {
        setloading(true);
        const response = await PocketProvperGoodsList({
          City: UserStore.user?.['city.cod'],
          UID: UserStore.user?.UserUID,
          NumNakl,
          NumProv,
          CheckShipment,
        });
        if (mounted) setgoodsList(response);
      } catch (error) {
        if (mounted) {
          alertActions(error + '');
        } else console.log('UNMOUNT');
      } finally {
        if (mounted) setloading(false);
      }
    },
    [mounted],
  );

  useEffect(() => {
    getList(true);
    return () => {
      props.route.params.getCurrNakladnaya(NumNakl);
      mounted = false;
    };
  }, []);

  const renderItem = React.useCallback(
    (type: any, item: ProvperGoodsRow) => {
      return (
        <View
          //@ts-ignore
          style={{
            height: 120,
            backgroundColor:
              currentItem?.CodGood === item.CodGood ? BRIGHT_GREY : null,
          }}>
          <View
            style={{
              height: 75,
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                //backgroundColor: 'red',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.textlist}>{item.CodGood}</Text>
              <TitleAndDiscribe title={'Кол-во Н'} discribe={item.QtyNakl} />
              <TitleAndDiscribe title={'Кол-во Ф'} discribe={item.QtyFact} />
            </View>
            <TitleAndDiscribe
              title={'Цена'}
              discribe={Number(item.Price).toFixed(3)}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                opacity: 0.6,
                fontWeight: '400',
              }}>
              {item.KatName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 45,
            }}>
            <TouchableOpacity
              style={styles.buttonCircle}
              onPress={() => changeQtyFunction(item)}>
              <Feather name="edit-2" size={20} color="white" />
            </TouchableOpacity>
            <View style={{width: 16}} />

            <TouchableOpacity
              style={styles.buttonCircle}
              onPress={() => minusFunction(item)}>
              <Feather name="minus" size={20} color="white" />
            </TouchableOpacity>
            <View style={{width: 16}} />

            <TouchableOpacity
              style={styles.buttonCircle}
              onPress={() => plusFunction(item)}>
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
            <View style={{width: 16}} />
          </View>

          <Divider />
        </View>
      );
    },
    [goodsList, currentItem],
  );

  return (
    <ScreenTemplate
      {...props}
      title={'Список товаров №' + props.route.params.NumNakl}>
      {/* <Button
        title="testscan"
        onPress={() => {
          setBarcode({...barcode, data: '1232132131313'});
        }}
      /> */}
      {loading && goodsList.length === 0 ? (
        <LoadingFlexComponent />
      ) : goodsList.length > 0 ? (
        <RecycleList
          customref={listRef}
          data={goodsList}
          itemHeight={120}
          onRefresh={getList}
          refreshing={loading}
          _rowRenderer={renderItem}
        />
      ) : (
        <EmptyFlexComponent />
      )}

      {mode && currentItem && (
        <ChangeGoodQtyProverkaNakladnyh
          mode={mode}
          changeQty={changeQty}
          item={{...currentItem, ...props.route.params}}
          visible={!!mode}
          setmodalVisible={() => setMode(null)}
        />
      )}
      <PressBotBar
        title={'Добавить товар'}
        onPress={goToAddGood}
        disabled={loading}
      />
    </ScreenTemplate>
  );
});

export default GoodsListScreenInProverka;

const styles = StyleSheet.create({
  textlist: {fontWeight: 'bold', fontSize: 16},
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});
