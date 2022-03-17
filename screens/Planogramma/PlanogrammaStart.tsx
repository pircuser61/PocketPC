import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {
  alertActions,
  BACK_COLOR,
  MAIN_COLOR,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import {CustomModalProps, PlanogrammaNavProps} from '../../types/types';
import Feather from 'react-native-vector-icons/Feather';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';
import {
  Plan,
  PocketPlanGet,
  PocketPlanGetProps,
} from '../../functions/PocketPlanGet';
import {observer} from 'mobx-react-lite';
import UserStore from '../../mobx/UserStore';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import WhiteCardForInfo from '../../components/SystemComponents/WhiteCardForInfo';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import SquareInfo from '../../components/RelocatePallets/SquareInfo';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import ModalTemplate from '../../components/ModalTemplate';
import InputField from '../../components/Perepalechivanie/InputField';
import {event} from 'react-native-reanimated';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {PocketPlanGoodsEmpty} from '../../functions/PocketPlanGoodsEmpty';
import {WsTaskDelete} from '../../functions/WsTaskDelete';
import {WsTaskReset} from '../../functions/WsTaskReset';
import ActionModalForErrorProv from '../../components/ProverkaNakladnyh/ActionModalForErrorProv';
import PlanogrammaActionModal from './PlanogrammaActionModal';

export type PlanogrammaPropsNav = NativeStackScreenProps<
  PlanogrammaNavProps,
  'PlanogrammaStart'
>;
const PlanogrammaStart = observer((props: PlanogrammaPropsNav) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [searchModal, setsearchModal] = useState(false);
  const [errorModal, seterrorModal] = useState(false);
  const [miniError, setminiError] = useState('');
  const [relativePosition, setRelativePosition] = useState<{
    first?: Plan;
    last?: Plan;
  }>({});
  const _api = PriemMestnyhHook();

  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      find(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const getList = async ({
    Cmd,
    NumPlan = '',
  }: {
    Cmd?: 'first' | 'curr' | 'next' | 'prev' | 'last';
    NumPlan?: string;
  }) => {
    try {
      setError('');
      setminiError('');
      setLoading(true);
      const response = await PocketPlanGet({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        CodShop:
          Cmd === 'next' || Cmd === 'prev'
            ? plan?.CodShop
            : UserStore.podrazd.Id,
        Cmd,
        NumPlan,
      });
      setPlan(response);
      console.log(response);
      switch (Cmd) {
        case 'first':
          setRelativePosition({...relativePosition, first: response});
          break;
        case 'last':
          setRelativePosition({...relativePosition, last: response});
          break;
        default:
          break;
      }
    } catch (err) {
      if (typeof err === 'string') {
        const error = err + '';

        if (error === 'Вы в конце списка') {
          setRelativePosition({
            ...relativePosition,
            last: plan as Plan,
          });

          setminiError('Вы в конце списка');
        } else if (error === 'Вы в начале списка') {
          setRelativePosition({
            ...relativePosition,
            first: plan as Plan,
          });
          setminiError('Вы в начале списка');
        } else if (error === 'Пусто' && (Cmd === 'first' || Cmd === 'last')) {
          setPlan(null);
        } else alertActions(err);
      } else alertActions(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFirst();
  }, []);

  const getFirst = () => {
    getList({
      Cmd: 'first',
    });
  };

  const getLast = () => {
    getList({
      Cmd: 'last',
    });
  };

  const getCurr = (NumPlan: string) => {
    getList({
      Cmd: 'curr',
      NumPlan,
    });
  };

  const getPrev = (NumPlan: string) => {
    getList({
      Cmd: 'prev',
      NumPlan,
    });
  };
  const getNext = (NumPlan: string) => {
    getList({
      Cmd: 'next',
      NumPlan,
    });
  };

  const find = async (txt: string) => {
    setsearchModal(false);
    getCurr(txt);
  };

  const SeachModal = (props: CustomModalProps) => {
    const [filtertext, setFilterText] = useState<string>('');
    const customref = useRef<TextInput>(null);
    useEffect(() => {
      setTimeout(() => customref.current?.focus(), 150);
    });

    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BACK_COLOR,
            width: SCREEN_WIDTH * 0.8,
            borderRadius: 8,
            padding: 16,
          }}>
          <InputField
            innerRef={customref}
            title={'Поиск паллеты'}
            placeholder={'Введите номер паллеты'}
            iconName={'magnify'}
            autofocus={false}
            onIconPress={() => {
              find(filtertext);
            }}
            value={filtertext}
            padding={0}
            titleColor={'black'}
            setValue={(txt: string) => setFilterText(txt)}
            onChangeText={() => {}}
            isTextInput={true}
            onSubmit={e => {
              find(e.nativeEvent.text);
            }}
          />
          <View style={{height: 8}} />
          <MenuListComponent
            data={[
              {
                action: () => find(filtertext),
                title: 'Искать',
                icon: 'check',
                loading: loading,
              },
            ]}
          />
          <View style={{height: 8}} />
          <MenuListComponent
            data={[
              {
                action: () => props.setmodalVisible(false),
                title: 'Закрыть',
                close: true,
              },
            ]}
          />
        </View>
      </ModalTemplate>
    );
  };

  const MenuInModal = ({prov}: {prov: Plan}) => {
    const [loadingdelete, setLoadingDelete] = useState(false);
    const [loadingToStack, setloadingToStack] = useState(false);

    return (
      <MenuListComponent
        data={[
          {
            action: async () => {
              try {
                setLoadingDelete(true);
                const response = await WsTaskDelete({
                  UID: UserStore.user?.UserUID,
                  City: UserStore.user?.['city.cod'],
                  Id: prov.TaskEmpty.TaskId,
                });
                seterrorModal(false);
                getCurr(prov.NumPlan);
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
                  Id: prov.TaskEmpty.TaskId,
                });
                seterrorModal(false);
                getCurr(prov.NumPlan);
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

  const goToPlanogrammaWorkWithPallet = (newPar: {
    canedit: boolean;
    planNum: string;
  }) => {
    if (plan?.TaskEmpty.TaskStatus === 'Pending') {
      Alert.alert('Внимание!', 'Задание в очереди', [{text: 'Ок'}]);
    } else props.navigation.navigate('PlanogrammaWorkWithPallet', newPar);
  };

  const obnulPlace = async (txt: string) => {
    try {
      setLoading(true);
      const response = await PocketPlanGoodsEmpty({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        NumPlan: txt,
      });
      getCurr(plan?.NumPlan ?? '');
    } catch (error) {
      setLoading(false);
      alertActions(error);
    }
  };

  return (
    <ScreenTemplate {...props} title={'Палетты планограммы'}>
      <View style={{flex: 1, padding: 16}}>
        {error.length > 0 ? (
          <ErrorAndUpdateComponent error={error} update={() => {}} />
        ) : loading ? (
          <LoadingFlexComponent />
        ) : plan ? (
          <View style={{flex: 1}}>
            <WhiteCardForInfo>
              <TitleAndDiscribe title="Номер паллеты" discribe={plan.NumPlan} />
            </WhiteCardForInfo>
            <View style={{height: 16}} />
            <WhiteCardForInfo>
              <TitleAndDiscribe title="Размещение" discribe={' '} />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <SquareInfo data={plan.CodDep} title={'Отдел'} />
                <SquareInfo data={plan.Place.NumStel} title={'Стелаж'} />
                <SquareInfo data={plan.Place.NumSec} title={'Секция'} />
                <SquareInfo data={plan.Place.NumPl} title={'Полка'} />
              </View>
            </WhiteCardForInfo>

            {(plan.TaskEmpty.TaskStatus === 'Error' ||
              plan.TaskEmpty.TaskStatus === 'Pending') && (
              <>
                <View style={{height: 8}} />
                <TouchableOpacity
                  disabled={plan.TaskEmpty.TaskStatus === 'Pending'}
                  activeOpacity={0.8}
                  onPress={() => seterrorModal(true)}
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor:
                      plan.TaskEmpty.TaskStatus === 'Error'
                        ? 'tomato'
                        : plan.TaskEmpty.TaskStatus === 'Pending'
                        ? 'orange'
                        : 'white',
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
                      {plan.TaskEmpty.TaskMessage.length > 0
                        ? plan.TaskEmpty.TaskMessage
                        : '---'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <View style={{flex: 1}} />
            <MenuListComponent
              data={[
                {
                  title: 'Редактирование места',
                  action: () => {
                    goToPlanogrammaWorkWithPallet({
                      canedit: true,
                      planNum: plan.NumPlan,
                    });
                  },
                  icon: 'edit',
                  disabled: plan.TaskEmpty.TaskStatus === 'Pending',
                },
                {
                  title: 'Просмотр места',
                  action: () => {
                    goToPlanogrammaWorkWithPallet({
                      canedit: false,
                      planNum: plan.NumPlan,
                    });
                  },
                  needChevrone: true,

                  disabled: plan.TaskEmpty.TaskStatus === 'Pending',
                },
                {
                  title: 'Обнулить место',
                  action: () => {
                    Alert.alert('Внимание!', 'Обнулить место?', [
                      {text: 'Нет'},
                      {text: 'Да', onPress: () => obnulPlace(plan.NumPlan)},
                    ]);
                  },
                  icon: 'retweet',
                },
              ]}
            />
          </View>
        ) : (
          <EmptyFlexComponent text={'Информации нет'} />
        )}
        {miniError.length > 0 ? (
          <>
            <View style={{height: 16}} />
            <WhiteCardForInfo>
              <Text style={{color: 'red'}}>{miniError}</Text>
            </WhiteCardForInfo>
          </>
        ) : null}
      </View>
      <View style={styles.buttonbar}>
        <IconButtonBottom onPress={getFirst} iconName="chevrons-left" />
        <IconButtonBottom
          onPress={() => {
            getPrev(plan?.NumPlan ?? '');
          }}
          iconName="chevron-left"
          opacity={plan?.NumPlan === relativePosition.first?.NumPlan ? 0 : 1}
        />
        <IconButtonBottom
          onPress={() => {
            setsearchModal(true);
          }}
          iconName="search"
        />
        <IconButtonBottom
          opacity={plan?.NumPlan === relativePosition.last?.NumPlan ? 0 : 1}
          onPress={() => {
            getNext(plan?.NumPlan ?? '');
          }}
          iconName="chevron-right"
        />
        <IconButtonBottom onPress={getLast} iconName="chevrons-right" />
      </View>
      {errorModal && plan && (
        <PlanogrammaActionModal
          {...props}
          MenuInModal={MenuInModal}
          prov={plan}
          setmodalVisible={() => seterrorModal(false)}
          visible={errorModal ? true : false}
        />
      )}
      {searchModal && (
        <SeachModal visible={searchModal} setmodalVisible={setsearchModal} />
      )}
    </ScreenTemplate>
  );
});

export default PlanogrammaStart;

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
    height: 40,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});

export const IconButtonBottom = ({
  onPress,
  iconName,
  opacity = 1,
}: {
  onPress: () => void;
  iconName: string;
  opacity?: 0 | 1;
}) => (
  <TouchableOpacity
    style={[styles.buttonCircle, {opacity}]}
    onPress={onPress}
    disabled={!opacity}>
    <Feather name={iconName} size={20} color="white" />
  </TouchableOpacity>
);
