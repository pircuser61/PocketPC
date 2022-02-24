import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {PocketProvperShops} from '../../functions/PocketProvperShops';
import UserStore from '../../mobx/UserStore';
import {ProverkaNakladnyhNavProps, ShopsRow} from '../../types/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  timeout,
} from '../../constants/funcrions';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import DropDownPicker from 'react-native-dropdown-picker';
import {TICustom} from '../ProverkaPallets/CreateCheckScreen';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import {PocketProvperCreate} from '../../functions/PocketProvperCreate';
import ProverkaNakladnyhStore from '../../mobx/ProverkaNakladnyhStore';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';

interface ParamsOfFuncCreation {
  FillSpecs: 'false' | 'true';
  CheckFactQty: 'false' | 'true';
  CodShop: string;
  Comment: string;
}

type Props = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'CreateProverka'
>;

const CreateProverka = observer((props: Props) => {
  const [list, setlist] = useState<ShopsRow[]>([]);
  const [error, seterror] = useState('');
  const [loading, setloading] = useState(true);
  const [loadingcreate, setloadingcreate] = useState(false);
  const [filter, setfilter] = useState('');
  const [codeshop, setcodeshop] = useState<ShopsRow | null>(null);
  const [comment, setComment] = useState<string>('');

  let mounted = true;

  const ref = useRef<any>(null);
  const ITEM_HEIGHT = 60;

  const createDateAskAlert = () => {
    try {
      if (!codeshop) {
        throw 'Не выбрано подразделение';
      }
      Alert.alert('Состояние зоны отгрузки', 'Добавить на текущую дату?', [
        {
          onPress: () => {},
          text: 'Отмена',
        },
        {
          onPress: () => {
            ActionAfterDateAsk('false');
          },
          text: 'Нет',
        },
        {
          onPress: () => {
            ActionAfterDateAsk('true');
          },
          text: 'Да',
        },
      ]);
    } catch (error) {
      alertActions(error);
    }
  };

  const ActionAfterDateAsk = (FillSpecs: 'false' | 'true') => {
    if (ProverkaNakladnyhStore.Type === '0') {
      createFactAskAlert(FillSpecs);
    } else
      endCreatingNaklad({
        CheckFactQty: 'false',
        CodShop: codeshop?.CodShop ?? '',
        Comment: comment,
        FillSpecs,
      });
  };

  const createFactAskAlert = (FillSpecs: 'false' | 'true') => {
    Alert.alert('Фактические остатки', 'Проверять?', [
      {
        onPress: () => {},
        text: 'Отмена',
      },
      {
        onPress: () => {
          endCreatingNaklad({
            CheckFactQty: 'false',
            CodShop: codeshop?.CodShop ?? '',
            Comment: comment,
            FillSpecs,
          });
        },
        text: 'Нет',
      },
      {
        onPress: () => {
          endCreatingNaklad({
            CheckFactQty: 'true',
            CodShop: codeshop?.CodShop ?? '',
            Comment: comment,
            FillSpecs,
          });
        },
        text: 'Да',
      },
    ]);
  };

  const endCreatingNaklad = async (funparams: ParamsOfFuncCreation) => {
    const {FillSpecs, CheckFactQty, CodShop, Comment} = funparams;

    try {
      setloadingcreate(true);
      const res = await PocketProvperCreate({
        CheckFactQty,
        City: UserStore.user?.['city.cod'],
        CodShop,
        Comment,
        FillSpecs,
        Type: ProverkaNakladnyhStore.Type,
        UID: UserStore.user?.UserUID,
      });

      props.route.params.addElementToList(res);
      props.navigation.goBack();
    } catch (error) {
      setloadingcreate(false);
      alertActions(error);
    }
  };

  const getShopsList = async () => {
    try {
      setloading(true);
      //await timeout(1000);
      const response = await PocketProvperShops({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
      });

      if (mounted) setlist(response);
    } catch (error) {
      console.log(error);
    } finally {
      if (mounted) {
        setloading(false);
      }
    }
  };

  useEffect(() => {
    getShopsList();
    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = React.useCallback(
    (type: any, item: ShopsRow) => {
      return (
        <TouchableOpacity
          onPress={() => {
            codeshop ? setcodeshop(null) : setcodeshop(item);
          }}
          style={{
            marginTop: 10,
            marginRight: 0,
            opacity: 1,
            marginLeft: 16,
          }}>
          <Text style={{fontSize: 20}}>{item.CodShop}</Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              opacity: 0.6,
              fontWeight: '400',
              marginBottom: 10,
              marginRight: 32,
            }}>
            {item.NameShop}
          </Text>
          <MaterialCommunityIcons
            name={codeshop ? 'close' : 'chevron-right'}
            size={24}
            color="black"
            style={{position: 'absolute', right: 16, marginTop: 10}}
          />
          <Divider />
        </TouchableOpacity>
      );
    },
    [list, codeshop],
  );

  return (
    <Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>
      <ScreenTemplate
        {...props}
        title={'Добавление проверки'}
        needsearchBar={false}
        value={filter}
        placeholder={'Введите номер подраздленеия'}
        onChangeText={setfilter}>
        <View style={{flex: 1}}>
          <View style={{padding: 16}}>
            <TICustom
              onChangeText={setComment}
              value={comment}
              title={'Комментарий'}
              width={'100%'}
            />
          </View>
          <View style={{height: 8}} />
          <Text style={{fontWeight: 'bold', paddingHorizontal: 16}}>
            Зона отгрузки:
          </Text>
          <View style={{height: 4}} />
          {error.length > 0 ? (
            <ErrorAndUpdateComponent
              error={error}
              update={() => getShopsList()}
            />
          ) : loading ? (
            <LoadingFlexComponent />
          ) : list.filter(r => r.CodShop.includes(filter)).length > 0 ? (
            codeshop ? (
              renderItem('', codeshop)
            ) : (
              <RecycleList
                data={list.filter(r => r.CodShop.includes(filter))}
                customref={ref}
                refreshing={loading}
                itemHeight={ITEM_HEIGHT}
                _rowRenderer={renderItem}
              />
            )
          ) : (
            <EmptyListComponent />
          )}
        </View>
        <PressBotBar onPress={createDateAskAlert} title={'Добавить проверку'} />
        {loadingcreate && (
          <LoadingModalComponent modalVisible={loadingcreate} />
        )}
      </ScreenTemplate>
    </Pressable>
  );
});

export default CreateProverka;

const styles = StyleSheet.create({});

/**
 *  <Text style={{fontWeight: 'bold'}}>Подразделение:</Text>
        <View style={{height: 4}} />
        <DropDownPicker
          labelStyle={{
            fontSize: 14,
            textAlign: 'left',
            color: '#000',
          }}
          zIndex={200}
          placeholder={
            list.length > 0
              ? 'Выберите подразделения'
              : error.length
              ? 'Ошибка! подразделения не загружены...'
              : 'Идет загрузка подразделений...'
          }
          items={list.map(r => {
            return {
              label: r.CodShop,
              value: r,
            };
          })}
          containerStyle={{height: 60}}
          style={{backgroundColor: 'white'}}
          itemStyle={{
            justifyContent: 'flex-start',
            height: 60,
            borderBottomWidth: 0.4,
            borderBottomColor: BRIGHT_GREY,
          }}
          activeLabelStyle={{fontWeight: 'bold'}}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => {
            // console.log(item);
            setcodeshop(item);
          }}
        />
        <View style={{height: 8}} />
 */
