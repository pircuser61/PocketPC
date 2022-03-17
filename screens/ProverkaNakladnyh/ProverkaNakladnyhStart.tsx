import {observer} from 'mobx-react-lite';
import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider} from 'react-native-paper';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {PocketProvperList} from '../../functions/PocketProvperList';
import UserStore from '../../mobx/UserStore';
import {ProverkaNakladnyhNavProps, ProvperRow} from '../../types/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  timeout,
} from '../../constants/funcrions';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import ProverkaOtchetModal from '../../components/ProverkaNakladnyh/ProverkaOtchetModal';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import ProverkaNakladnyhStore from '../../mobx/ProverkaNakladnyhStore';
import {enableFreeze} from 'react-native-screens';
import {Freeze} from 'react-freeze';
import ActionModalForErrorProv from '../../components/ProverkaNakladnyh/ActionModalForErrorProv';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import {WsTaskDelete} from '../../functions/WsTaskDelete';
import {WsTaskReset} from '../../functions/WsTaskReset';

enableFreeze(true);

export type NakladProvProps = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'ProverkaNakadnyhStart'
>;

const ProverkaNakladnyhStart = observer((props: NakladProvProps) => {
  const [list, setlist] = useState<ProvperRow[]>([]);
  const [error, seterror] = useState('');
  const [filter, setfilter] = useState(UserStore.podrazd.Id);
  const {Type} = props.route.params;
  const [chossen, setchossen] = useState('');

  const [loading, setloading] = useState(true);
  const [numProv, setnumProv] = useState('');
  const [provWithErr, setProvWithErr] = useState<null | ProvperRow>(null);

  const ref = useRef<any>(null);
  const ITEM_HEIGHT = 100;

  const getList = async (_filter = '', type: string = '') => {
    try {
      seterror('');
      setloading(true);
      const response = await PocketProvperList({
        City: UserStore.user?.['city.cod'],
        FilterShop: _filter,
        UID: UserStore.user?.UserUID,
        Type: type,
      });
      setfilter(_filter);
      setlist(response);
    } catch (error) {
      seterror(error + '');
    } finally {
      setloading(false);
    }
  };

  const addElementToList = async (newList: {
    CodShop: string;
    Comment: string;
    NumProv: string;
    Provper: ProvperRow[];
  }) => {
    setlist(newList.Provper);
    setchossen(newList.NumProv);
    setfilter(newList.CodShop);

    await timeout(150);
    scrollToBot(newList.Provper);
  };

  const scrollToBot = (list: any = []) => {
    ref?.current?.scrollToOffset(0, list.length * ITEM_HEIGHT, true);
  };

  const MenuInModal = ({prov}: {prov: ProvperRow}) => {
    const [loadingdelete, setLoadingDelete] = useState(false);
    const [loadingToStack, setloadingToStack] = useState(false);

    return (
      <MenuListComponent
        data={[
          {
            action: () => {
              setchossen(prov.NumProv);
              props.navigation.navigate('WorkWithNakladnaya', {
                NumProv: prov.NumProv,
              });
              setProvWithErr(null);
            },
            title: 'Продолжить работу',
            needChevrone: true,
          },
          {
            action: async () => {
              try {
                setLoadingDelete(true);
                const response = await WsTaskDelete({
                  UID: UserStore.user?.UserUID,
                  City: UserStore.user?.['city.cod'],
                  Id: prov.TaskId,
                });
                setProvWithErr(null);
                getList(filter, Type);
              } catch (error) {
                setLoadingDelete(false);
                alertActions(error);
              }
            },
            title: 'Не показывать',
            loading: loadingdelete,
            icon: 'eyeo',
            disabled: loadingdelete,
          },
          {
            action: async () => {
              try {
                setloadingToStack(true);
                const response = await WsTaskReset({
                  UID: UserStore.user?.UserUID,
                  City: UserStore.user?.['city.cod'],
                  Id: prov.TaskId,
                });
                setProvWithErr(null);
                getList(filter, Type);
              } catch (error) {
                setloadingToStack(false);
                alertActions(error);
              }
            },
            title: 'В очередь',
            icon: 'retweet',
            loading: loadingToStack,
            disabled: loadingToStack,
          },
        ]}
      />
    );
  };

  const renderItem = React.useCallback(
    (type: any, item: ProvperRow) => {
      return (
        <View
          style={{
            backgroundColor: item.NumProv === chossen ? BRIGHT_GREY : undefined,
            height: ITEM_HEIGHT,
          }}>
          <TouchableOpacity
            disabled={item.TaskStatus === 'Pending'}
            delayLongPress={300}
            onLongPress={() => {
              setchossen(item.NumProv);
              setnumProv(item.NumProv);
            }}
            onPress={() => {
              if (item.TaskStatus === 'None') {
                setchossen(item.NumProv);
                props.navigation.navigate('WorkWithNakladnaya', {
                  NumProv: item.NumProv,
                });
              } else if (item.TaskStatus === 'Error') {
                setchossen(item.NumProv);
                setProvWithErr(item);
              }
            }}
            style={{
              height: ITEM_HEIGHT - 1,
              justifyContent: 'center',
            }}>
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 16}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {item.NumProv}{' '}
                <Text style={{fontSize: 16, fontWeight: 'normal'}}>
                  ({item.CodShop})
                </Text>
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  opacity: 0.6,
                  fontWeight: '400',
                }}>
                {item.Comment.length > 0 ? item.Comment : '---'}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="black"
                style={{position: 'absolute', right: 16, marginTop: 10}}
              />
            </View>

            {(item.TaskStatus === 'Error' || item.TaskStatus === 'Pending') && (
              <View
                style={{
                  justifyContent: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    opacity: 1,
                    fontWeight: '400',
                  }}>
                  Статус:{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {item.TaskMessage.length > 0 ? item.TaskMessage : '---'}
                  </Text>
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Divider />
          <View
            style={{
              position: 'absolute',
              backgroundColor:
                item.TaskStatus === 'Error'
                  ? 'tomato'
                  : item.TaskStatus === 'Pending'
                  ? 'orange'
                  : undefined,
              left: 0,
              width: 10,
              height: '100%',
            }}
          />
        </View>
      );
    },
    [list, chossen],
  );

  useEffect(() => {
    ProverkaNakladnyhStore.Type = Type ?? '';
    getList(filter, Type);

    return () => {
      ProverkaNakladnyhStore.resetStore();
    };
  }, []);

  return (
    <ScreenTemplate
      {...props}
      title={
        (ProverkaNakladnyhStore.Type === '1'
          ? 'Глав. меню -> '
          : 'Инвент. -> ') + 'Проверка накладных'
      }>
      <View style={{flex: 1}}>
        {error.length > 0 ? (
          <ErrorAndUpdateComponent
            error={error}
            update={() => getList(filter, Type)}
          />
        ) : loading && list.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={26} color={MAIN_COLOR} />
          </View>
        ) : list.length > 0 ? (
          <RecycleList
            data={list}
            customref={ref}
            onRefresh={() => getList(filter, props.route.params.Type)}
            refreshing={loading}
            itemHeight={ITEM_HEIGHT}
            _rowRenderer={renderItem}
          />
        ) : (
          <EmptyListComponent />
        )}
        {list.filter(
          r => r.TaskStatus === 'Pending' || r.TaskStatus === 'Error',
        ).length > 0 && (
          <TouchableOpacity
            onPress={() => getList(filter, Type)}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              backgroundColor: MAIN_COLOR,
              bottom: 24,
              right: 16,
              padding: 16,
              borderRadius: 16,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'right',
                fontSize: 12,
              }}>
              Обновить список
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <PressBotBar
          title={`Добавить`}
          onPress={() => {
            props.navigation.navigate('CreateProverka', {addElementToList});
          }}
          width={'50%'}
        />
        <PressBotBar
          title={`Фильтр (${filter.length > 0 ? filter : 'все'})`}
          onPress={() => {
            props.navigation.navigate('FilterNakladnyhScreen', {
              getList: getList,
            });
          }}
          width={'50%'}
        />
      </View>

      {numProv.length > 0 && (
        <ProverkaOtchetModal
          numProv={numProv}
          setmodalVisible={() => setnumProv('')}
          visible={setnumProv.length > 0 ? true : false}
        />
      )}
      {provWithErr && (
        <ActionModalForErrorProv
          {...props}
          setchossen={setchossen}
          MenuInModal={MenuInModal}
          prov={provWithErr}
          setmodalVisible={() => setProvWithErr(null)}
          visible={provWithErr ? true : false}
        />
      )}
    </ScreenTemplate>
  );
});

export default ProverkaNakladnyhStart;

const styles = StyleSheet.create({});
