import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import WhiteCardForInfo from '../../components/SystemComponents/WhiteCardForInfo';
import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {GoodsRow, PocketPlanGoodsGet} from '../../functions/PocketPlanGoodsGet';
import UserStore from '../../mobx/UserStore';
import {PlanogrammaNavProps} from '../../types/types';
import {IconButtonBottom} from './PlanogrammaStart';
import Feather from 'react-native-vector-icons/Feather';
import ChangeGoodQtyCheckModal from '../../components/GlobalProverka/ChangeGoodQtyCheckModal';
import ChangeCoodQtyPlanogramma from '../../components/Planogramma/ChangeCoodQtyPlanogramma';

export type PlanogrammaPropsNav = NativeStackScreenProps<
  PlanogrammaNavProps,
  'PlanogrammaWorkWithPallet'
>;

const PlanogrammaWorkWithPallet = observer((props: PlanogrammaPropsNav) => {
  const {canedit, planNum} = props.route.params;
  const [goodinfo, setgoodinfo] = useState<GoodsRow | null>(null);
  const [miniError, setminiError] = useState('');
  const [loading, setloading] = useState<boolean>(true);
  const [mode, setMode] = useState<'-1' | '0' | '1' | null>(null);

  const [index, setIndex] = useState(false);
  const [relativePosition, setRelativePosition] = useState<{
    first?: GoodsRow;
    last?: GoodsRow;
  }>({});

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const getFirst = () => {
    getGoodInfo({Cmd: 'first'});
  };

  const getLast = () => {
    getGoodInfo({Cmd: 'last'});
  };

  const getCurr = (CodGood: string) => {};

  const getPrev = (CodGood: string) => {
    getGoodInfo({Cmd: 'prev', CodGood});
  };
  const getNext = (CodGood: string) => {
    getGoodInfo({Cmd: 'next', CodGood});
  };

  const goToCreateOrFind = () => {
    props.navigation.navigate('AddOrFindGood', {
      action: str => addOrFindGood(str, true),
      title: canedit ? 'Добавление товара' : 'Поиск товара',
      inputtitle: 'Баркод',
    });
  };

  const addOrFindGood = async (Barcod: string, isSecondScreen = false) => {
    try {
      if (canedit) {
        await getGoodInfo({Cmd: 'create', Barcod, isSecondScreen});
      } else await getGoodInfo({Cmd: 'find', Barcod, isSecondScreen});
    } catch (error) {
      throw error;
    }
  };

  const plusFunction = React.useCallback(() => {
    if (canedit) setMode('1');
  }, [mode]);

  const minusFunction = React.useCallback(() => {
    if (canedit) setMode('-1');
  }, [mode]);

  const changeQtyFunction = React.useCallback(() => {
    if (canedit) setMode('0');
  }, [mode]);

  const getGoodInfo = async ({
    Cmd,
    Barcod,
    CodGood,
    isSecondScreen = false,
  }: {
    Cmd: 'first' | 'curr' | 'next' | 'prev' | 'last' | 'find' | 'create';
    CodGood?: string;
    Barcod?: string;
    isSecondScreen?: boolean;
  }) => {
    try {
      setminiError('');
      setloading(true);
      const response = await PocketPlanGoodsGet({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        NumPlan: planNum,
        Cmd,
        CodGood,
        Barcod,
      });
      setgoodinfo(response);
      if (!relativePosition.first) {
        setRelativePosition({
          ...relativePosition,
          first: response,
        });
      }

      switch (Cmd) {
        case 'first':
          setRelativePosition({...relativePosition, first: response});
          break;
        case 'last':
          setRelativePosition({...relativePosition, last: response});
          break;
        case 'create':
        case 'prev':
        case 'next':
          if (!!relativePosition.first) {
            if (
              Number(response.CodGood ?? 0) <
              Number(relativePosition.first.CodGood)
            ) {
              setRelativePosition({
                ...relativePosition,
                first: response,
              });
              console.log('FIRST: ' + response.CodGood);
              console.log('SECOND: ' + relativePosition.first.CodGood);
            }
          }
          if (!!relativePosition.last) {
            if (
              Number(response.CodGood ?? 0) >
              Number(relativePosition.last.CodGood)
            ) {
              setRelativePosition({
                ...relativePosition,
                last: response,
              });
              console.log('FIRST: ' + response.CodGood);
              console.log('SECOND: ' + relativePosition.last.CodGood);
            }
          }
          break;
        case 'next':
          console.log(response + Cmd);
          break;
        case 'create':
          console.log(response + Cmd);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      if (isSecondScreen) {
        throw error;
      } else {
        if (error === 'Информации о товаре нет') {
          if (Cmd === 'prev') {
            setminiError('Вы в начале списка!');
            setRelativePosition({
              ...relativePosition,
              first: goodinfo!,
            });
          } else if (Cmd === 'next') {
            setminiError('Вы в конце списка!');
            setRelativePosition({
              ...relativePosition,
              last: goodinfo!,
            });
          }
        } else alertActions(error);
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getFirst();
  }, []);

  useEffect(() => {
    if (barcode.data) {
      addOrFindGood(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  return (
    <ScreenTemplate
      {...props}
      title={canedit ? 'Редактирование месте' : 'Просмотр места'}>
      {loading ? (
        <LoadingFlexComponent />
      ) : goodinfo ? (
        <View style={{flex: 1, padding: 16}}>
          <WhiteCardForInfo
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
            }}>
            <Text style={{fontWeight: 'bold'}}>
              {goodinfo?.Katalog?.Flag.length > 0
                ? goodinfo.Katalog.Flag
                : '---'}
            </Text>
            <Text style={{fontWeight: 'bold'}}>{goodinfo.CodGood}</Text>
            <Text style={{fontWeight: 'bold'}}>
              {Number(goodinfo.Qty).toFixed(2)}
            </Text>
          </WhiteCardForInfo>
          <View style={{height: 16}} />
          {index ? (
            <BarcodesBox goodInfo={goodinfo} />
          ) : (
            <WhiteCardForInfo
              style={{
                padding: 16,
                flex: 1,
              }}>
              <TitleAndDiscribe
                title="Остаток"
                discribe={Number(goodinfo.ShopQty) + ''}
              />
              <TitleAndDiscribe
                title="Артикул"
                discribe={goodinfo.Katalog.Art}
              />
              <Text style={{}}>{goodinfo.Katalog.Name}</Text>
              <TitleAndDiscribe
                title="Цена"
                discribe={Number(goodinfo.Price ?? 0).toFixed(3)}
              />
            </WhiteCardForInfo>
          )}
          <TouchableOpacity onPress={() => setIndex(!index)}>
            <WhiteCardForInfo
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                marginVertical: 16,
                backgroundColor: MAIN_COLOR,
              }}>
              <TitleAndDiscribe
                title={'Б'}
                discribe={goodinfo.ScanBar}
                color="white"
              />

              <TitleAndDiscribe
                title={'К'}
                color="white"
                discribe={goodinfo.ScanQuant}
              />
            </WhiteCardForInfo>
          </TouchableOpacity>
        </View>
      ) : (
        <EmptyFlexComponent text="Информации о товаре нет" />
      )}
      <Text style={{color: 'red', alignSelf: 'center'}}>{miniError}</Text>
      {goodinfo !== null && !loading && (
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            padding: 16,
          }}>
          <TouchableOpacity
            disabled={!canedit}
            style={[
              styles.buttonCircle,
              {
                opacity: canedit ? 1 : 0.7,
              },
            ]}
            onPress={changeQtyFunction}>
            <Feather name="edit-2" size={20} color="white" />
          </TouchableOpacity>
          <View style={{width: 16}} />
          <TouchableOpacity
            disabled={!canedit}
            style={[
              styles.buttonCircle,
              {
                opacity: canedit ? 1 : 0.7,
              },
            ]}
            onPress={minusFunction}>
            <Feather name="minus" size={20} color="white" />
          </TouchableOpacity>
          <View style={{width: 16}} />
          <TouchableOpacity
            disabled={!canedit}
            style={[
              styles.buttonCircle,
              {
                opacity: canedit ? 1 : 0.7,
              },
            ]}
            onPress={plusFunction}>
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      {mode && (
        <ChangeCoodQtyPlanogramma
          setGoodInfo={setgoodinfo}
          item={{...(goodinfo as GoodsRow), NumPlan: planNum}}
          goodInfo={goodinfo as GoodsRow}
          visible={mode === '-1' || mode === '0' || mode === '1'}
          mode={mode}
          setmodalVisible={() => {
            setMode(null);
          }}
        />
      )}
      <View style={styles.buttonbar}>
        <IconButtonBottom onPress={getFirst} iconName="chevrons-left" />
        <IconButtonBottom
          onPress={() => {
            getPrev(goodinfo?.CodGood ?? '');
          }}
          iconName="chevron-left"
          opacity={
            goodinfo?.CodGood === relativePosition.first?.CodGood ? 0 : 1
          }
        />
        <IconButtonBottom onPress={goToCreateOrFind} iconName="plus" />
        <IconButtonBottom
          opacity={goodinfo?.CodGood === relativePosition.last?.CodGood ? 0 : 1}
          onPress={() => {
            getNext(goodinfo?.CodGood ?? '');
          }}
          iconName="chevron-right"
        />
        <IconButtonBottom onPress={getLast} iconName="chevrons-right" />
      </View>
    </ScreenTemplate>
  );
});

export default PlanogrammaWorkWithPallet;

const styles = StyleSheet.create({
  buttonbar: {
    backgroundColor: MAIN_COLOR,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});

const BarcodesBox = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{width: SCREEN_WIDTH * 0.35}}>{item.Cod}</Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
              textAlign: 'center',
            }}>
            {Number(item.Quant).toFixed(3)}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 12, alignSelf: 'center', fontWeight: 'bold'}}>
        Список баркодов
      </Text>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.35,
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          Баркод
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Коэф-нт
        </Text>
      </WhiteCardForInfo>
      <FlatList
        data={goodInfo.BcdList}
        keyExtractor={(item, index) => item.Cod + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};
