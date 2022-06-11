import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {alertActions, MAIN_COLOR, timeout} from '../../constants/funcrions';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {GlobalCheckNavProps} from '../../types/types';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {PocketProvGoodsCreate} from '../../functions/PocketProvGoodsCreate';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import BottomMenuCheckBar from '../../components/GlobalProverka/BottomMenuCheckBar';
import Feather from 'react-native-vector-icons/Feather';
import ChangeGoodQtyCheckModal from '../../components/GlobalProverka/ChangeGoodQtyCheckModal';
import WhiteCardForInfo from '../../components/SystemComponents/WhiteCardForInfo';
import {Divider} from 'react-native-paper';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import {PocketProvGoodsDelete} from '../../functions/PocketProvGoodsDelete';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import HorizontalListForDocument from '../../components/GlobalProverka/HorizontalListForDocument';
import {GoodsRow} from '../../types/ProverkaTypes';
import {
  PocketProvGoodsGet,
  PocketProvGoodsGetProps,
} from '../../functions/PocketProvGoodsGet';
import DocumentStatusButton from '../../components/GlobalProverka/DocumentStatusButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type DocumentCheckScreenProps = NativeStackScreenProps<
  GlobalCheckNavProps,
  'DocumentCheckScreen'
>;

const DocumentCheckScreen = observer((props: DocumentCheckScreenProps) => {
  //<--------------ПЕРЕМЕННЫЕ-------------->

  function logMount() {
    console.log('МАУНТ:' + mounted);
  }

  const {item} = props.route.params;
  const QRDocType = props.route.params.QRDocType;

  const [goodInfo, setgoodInfo] = useState<GoodsRow | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const [relativePosition, setRelativePosition] = useState<{
    first?: {idNum?: string; CodGood?: string};
    last?: {idNum?: string; CodGood?: string};
  }>({});
  const [filter, setFilter] = useState<'true' | 'false'>('true');
  const [mode, setMode] = useState<'-1' | '0' | '1' | null>(null);
  const [miniError, setminiError] = useState('');
  let mounted = true;
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const listItems = [0, 1, 2, 3, 4];
  const customRef = React.useRef<FlatList>(null);
  const [renderfrom, setrenderfrom] = useState(0);
  const [index, setIndex] = useState(0);

  //<--------------ПЕРЕМЕННЫЕ/-------------->

  //<--------------ФУНКЦИИ-------------->

  const scrollToNextElement = React.useCallback(() => {
    if (index < listItems.length - 1) {
      const newIndex = index + 1;
      //customRef.current?.scrollToIndex({index: newIndex, animated: false});
      setIndex(newIndex);
      //setrenderfrom(newIndex);
      return;
    }
    if (index === listItems.length - 1) {
      const newIndex = 0;
      //customRef.current?.scrollToIndex({index: newIndex, animated: false});
      setIndex(newIndex);
      //setrenderfrom(newIndex);
      return;
    }
  }, [index]);

  const deleteGood = async () => {
    try {
      setminiError('');
      setloading(true);
      const response = await PocketProvGoodsDelete({
        CodGood: goodInfo?.CodGood,
        IdNum: goodInfo?.IdNum,
        All: filter,
        City: UserStore.user?.['city.cod'],
        NumDoc: item.NumDoc,
        NumNakl: item.NumNakl,
        Type: CheckPalletsStore.Type,
        UID: UserStore.user?.UserUID,
      });

      getGoodInfo({Item: response as GoodsRow});
    } catch (error) {
      if (error === 'Информации о товаре нет') {
        if (goodInfo?.IdNum === relativePosition.first?.idNum) {
          setRelativePosition({...relativePosition, first: undefined});
        }
        setgoodInfo(null);
      } else alertActions(error + '');
    } finally {
      setloading(false);
    }
  };

  const createDeleteAlert = () => {
    Alert.alert('Внимание!', 'Удалить товар ' + goodInfo?.CodGood + '?', [
      {text: 'Отмена', style: 'cancel'},
      {text: 'Удалить', style: 'default', onPress: deleteGood},
    ]);
  };

  const getCurr = () => {
    getGoodInfo({
      Cmd: 'curr',
      CodGood: goodInfo?.CodGood,
      IdNum: goodInfo?.IdNum,
      All: filter,
      City: UserStore.user?.['city.cod'],
      DisplayMode: 'all',
      NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
      Type: CheckPalletsStore.Type,
      UID: UserStore.user?.UserUID,
    });
  };

  const plusFunction = React.useCallback(() => {
    setMode('1');
  }, [mode]);

  const minusFunction = React.useCallback(() => {
    setMode('-1');
  }, [mode]);

  const changeQtyFunction = React.useCallback(() => {
    setMode('0');
  }, [mode]);

  const getGoodInfo = async (props: PocketProvGoodsGetProps) => {
    try {
      setminiError('');
      setloading(true);
      const response = !!props.Item
        ? props.Item
        : ((await PocketProvGoodsGet({...props})) as GoodsRow);
      if (mounted) {
        setgoodInfo(response);
        if (!relativePosition.first) {
          setRelativePosition({
            ...relativePosition,
            first: {idNum: response.IdNum, CodGood: response.CodGood},
          });
        }

        if (!!relativePosition.first) {
          if (
            Number(response.CodGood ?? 0) <
            Number(relativePosition.first.CodGood)
          ) {
            setRelativePosition({
              ...relativePosition,
              first: {idNum: response.IdNum, CodGood: response.CodGood},
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
              last: {idNum: response.IdNum, CodGood: response.CodGood},
            });
            console.log('FIRST: ' + response.CodGood);
            console.log('SECOND: ' + relativePosition.last.CodGood);
          }
        }
      } else logMount();
    } catch (error) {
      console.log(error);

      if (error === 'Информации о товаре нет') {
        if (props.Cmd === 'prev') {
          setminiError('Вы в начале списка!');
          setRelativePosition({
            ...relativePosition,
            first: {CodGood: goodInfo?.CodGood, idNum: goodInfo?.IdNum},
          });
        } else if (props.Cmd === 'next') {
          setminiError('Вы в конце списка!');
          setRelativePosition({
            ...relativePosition,
            last: {idNum: goodInfo?.IdNum, CodGood: goodInfo?.CodGood},
          });
        }
      } else {
        if (mounted) alertActions(error);
        else console.log('Ошибка отловлена в бэк');
      }
    } finally {
      if (mounted) {
        setloading(false);
      }
    }
  };

  const getPrefGood = () => {
    getGoodInfo({
      Cmd: 'prev',
      CodGood: goodInfo?.CodGood,
      IdNum: goodInfo?.IdNum,
      All: filter,
      City: UserStore.user?.['city.cod'],
      DisplayMode: 'all',
      NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
      Type: CheckPalletsStore.Type,
      UID: UserStore.user?.UserUID,
      Shop: UserStore.podrazd.Id,
    });
  };

  const getNextGood = () => {
    getGoodInfo({
      Cmd: 'next',
      CodGood: goodInfo?.CodGood,
      IdNum: goodInfo?.IdNum,
      All: filter,
      City: UserStore.user?.['city.cod'],
      DisplayMode: 'all',
      NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
      Type: CheckPalletsStore.Type,
      UID: UserStore.user?.UserUID,
      Shop: UserStore.podrazd.Id,
    });
  };

  const swipeFilter = () => {
    setminiError('');
    setRelativePosition({});
    if (filter === 'true') {
      setFilter('false');
    } else if (filter === 'false') {
      setFilter('true');
    } else {
      setFilter('false');
    }
  };
  /*
  const getInfoByIDNUM = (Item: GoodsRow) => {
    getGoodInfo({
      All: filter,
      City: UserStore.user?.['city.cod'],
      Cmd: 'curr',
      IdNum: Item.IdNum,
      DisplayMode: 'all',
      NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
      Type: CheckPalletsStore.Type,
      UID: UserStore.user?.UserUID,
      Item: Item,
      Shop: UserStore.podrazd.Id,
    });
  };
*/
  const navigateToCreate = () => {
    if (CheckPalletsStore.Type === '7') {
      Alert.alert('Внимание', 'Добавление для типа 7 запрещено', [
        {text: 'Закрыть', style: 'cancel'},
      ]);
    } else {
      props.navigation.navigate('AddGoodsInCheckScreen', {
        action: str => addGood(str, true),
        title: 'Добавление товара',
        inputtitle: 'Баркод',
      });
    }
  };

  const navigateToQR = () => {
    console.log('GoToQR: ' + item.NumNakl + ' ' + item.NumDoc);
    //@ts-ignore
    props.navigation.navigate('MarkHonest', {
      ...props.route.params,
      NumProv: item.NumNakl,
      NumPal: item.NumDoc,
      SpecsType: QRDocType,
      IdNum: goodInfo?.IdNum,
      QtyReqd: goodInfo ? goodInfo.QtyFact : 0,
    });
  };

  const addGood = async (bcd = '', isSecondScreen = false) => {
    try {
      setminiError('');
      setloading(true);
      const response = await PocketProvGoodsCreate({
        City: UserStore.user?.['city.cod'],
        NumNakl: props.route?.params.item.NumNakl,
        Type: CheckPalletsStore.Type,
        NumDoc: props.route?.params.item.NumDoc,
        UID: UserStore.user?.UserUID,
        BarCod: bcd,
        DisplayShop: UserStore.podrazd.Id,
      });
      getGoodInfo({Item: response as GoodsRow});
    } catch (error) {
      if (isSecondScreen) {
        throw error;
      } else {
        if (mounted) alertActions(error);
        else console.log('Ошибка отловлена в бэк');
      }
    } finally {
      setloading(false);
    }
  };

  //<--------------ФУНКЦИИ/-------------->

  //<--------------ЭФФЕКТЫ-------------->

  useEffect(() => {
    setgoodInfo(null);
    getGoodInfo({
      All: filter,
      City: UserStore.user?.['city.cod'],
      Cmd: 'first',
      DisplayMode: 'all',
      NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
      Type: CheckPalletsStore.Type,
      UID: UserStore.user?.UserUID,
      Shop: UserStore.podrazd.Id,
    });
  }, [filter]);

  useEffect(() => {
    if (barcode.data) {
      console.log(barcode);

      if (CheckPalletsStore.Type === '7') {
        Alert.alert('Внимание', 'Добавление для типа 7 запрещено', [
          {text: 'Закрыть', style: 'cancel'},
        ]);
      } else addGood(barcode.data);

      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    return () => {
      mounted = false;
      if (props.route.params.action) props.route.params.action();
    };
  }, []);

  //<--------------ЭФФЕКТЫ/-------------->

  return (
    <ScreenTemplate
      {...props}
      title={CheckPalletsStore.Title.thirdScreen + ' №' + item.NumDoc}>
      {loading ? (
        <LoadingFlexComponent />
      ) : !goodInfo ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Нет информации о товаре</Text>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{flex: 1}}>
            <WhiteCardForInfo
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                marginHorizontal: 16,
                marginVertical: 8,
              }}>
              <Text style={{fontWeight: 'bold'}}>
                {(filter === 'false' ? 'F' : ' ') + ' ' + goodInfo.CodGood}
              </Text>
              <Text style={{fontWeight: 'bold'}}>{goodInfo.QtyDoc}</Text>
              <Text style={{fontWeight: 'bold'}}>{goodInfo.QtyFact}</Text>
            </WhiteCardForInfo>

            <HorizontalListForDocument
              index={index}
              goodInfo={goodInfo}
              listItems={listItems}
              customRef={customRef}
            />

            <TouchableOpacity
              onPress={scrollToNextElement}
              onLongPress={() => setIndex(0)}>
              <WhiteCardForInfo
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 16,
                  marginHorizontal: 16,
                  marginVertical: 8,
                  backgroundColor: MAIN_COLOR,
                }}>
                <TitleAndDiscribe
                  title={'Б'}
                  discribe={goodInfo.ScanBarCod}
                  color="white"
                />

                <TitleAndDiscribe
                  title={'К'}
                  color="white"
                  discribe={goodInfo.ScanBarQuant}
                />
              </WhiteCardForInfo>
            </TouchableOpacity>
            <Divider />
            <Text style={{color: 'red', alignSelf: 'center'}}>{miniError}</Text>
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
        }}>
        <DocumentStatusButton
          NumDoc={item.NumDoc}
          NumNakl={item.NumNakl}
          goodInfo={goodInfo}
        />

        {goodInfo !== null && !loading && (
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            {QRDocType && (
              <TouchableOpacity
                style={[
                  styles.buttonCircle,
                  {
                    opacity: 1,
                    marginRight: 8,
                    marginLeft: 8,
                  },
                ]}
                onPress={navigateToQR}>
                <MaterialCommunityIcons
                  name={'qrcode-scan'}
                  color="white"
                  size={20}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.buttonCircle,
                {
                  opacity: 1,
                  marginRight: 8,
                },
              ]}
              onPress={changeQtyFunction}>
              <Feather name="edit-2" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonCircle,
                {
                  opacity: 1,
                  marginRight: 8,
                },
              ]}
              onPress={minusFunction}>
              <Feather name="minus" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonCircle,
                {
                  opacity: 1,
                },
              ]}
              onPress={plusFunction}>
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomMenuCheckBar
        {...props}
        navigateToCreate={navigateToCreate}
        createDeleteAlert={createDeleteAlert}
        relativePosition={relativePosition}
        getNext={getNextGood}
        item={item}
        getPrev={getPrefGood}
        goodInfo={goodInfo}
        swipeFilter={swipeFilter}
        filter={filter}
        getCurr={getCurr}
      />

      {mode && (
        <ChangeGoodQtyCheckModal
          setGoodInfo={setgoodInfo}
          item={item}
          goodInfo={goodInfo as GoodsRow}
          visible={mode === '-1' || mode === '0' || mode === '1'}
          mode={mode}
          setmodalVisible={() => {
            setMode(null);
          }}
        />
      )}
    </ScreenTemplate>
  );
});

export default DocumentCheckScreen;

const styles = StyleSheet.create({
  navigationArrows: {
    height: 60,
    width: 60,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
