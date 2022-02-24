import {MotiView} from '@motify/components';
import {useAnimationState} from '@motify/core';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Divider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  alertActions,
  BACK_COLOR,
  BRIGHT_GREY,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  timeout,
} from '../../constants/funcrions';
import {PocketProvDelete} from '../../functions/PocketProvDelete';
import {PocketProvDeps} from '../../functions/PocketProvDeps';
import {PocketProvState} from '../../functions/PocketProvState';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {
  BottomSheetProps,
  DepartRow,
  MenuActionProps,
  PalletInListCheck,
} from '../../types/types';
import EmptyListComponent from '../SystemComponents/EmptyListComponent';
import LoadingFlexComponent from '../SystemComponents/LoadingFlexComponent';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';
import BottomSheetButtom from './BottomSheetButtom';
import TitleAndDiscribe from './TitleAndDiscribe';

const ProverkaTouchBottomSheet = observer(
  ({heignt = 0, navigation}: BottomSheetProps | any) => {
    const [listofDeps, setlistofDeps] = useState<DepartRow[]>([]);
    const [loadingotdels, setloadingotdels] = useState<boolean>(false);

    const showOtdels = async () => {
      try {
        setloadingotdels(true);

        if (animationState.current === 'to') {
          animationState.transitionTo('left');
        }
        const response = await PocketProvDeps({
          City: UserStore.user?.['city.cod'],
          Type: CheckPalletsStore.Type,
          UID: UserStore.user?.UserUID,
          NumNakl: CheckPalletsStore.curretElement?.ID,
        });

        setlistofDeps(response);
      } catch (error) {
        alertActions(error);
      } finally {
        if (CheckPalletsStore.curretElement !== null) setloadingotdels(false);
      }
    };

    const changeStatus = async () => {
      try {
        const curel = CheckPalletsStore.curretElement as PalletInListCheck;
        const position = curel.id;

        const response = await PocketProvState({
          City: UserStore.user?.['city.cod'],
          NumNakl: CheckPalletsStore.curretElement?.ID,
          State: curel.Flag === '#' ? 'close' : 'open',
          Type: '7',
          UID: UserStore.user?.UserUID,
        });
        console.log(response);

        if (curel.Flag === '#') {
          curel.Flag = '@';
          CheckPalletsStore.list_of_elements[position - 1].Flag = '@';
        } else {
          curel.Flag = '#';
          CheckPalletsStore.list_of_elements[position - 1].Flag = '#';
        }
        CheckPalletsStore.curretElement = curel;
      } catch (error) {
        alertActions(error);
      }
    };

    const actionsArray1: MenuActionProps[] = [
      {
        needChevrone: true,
        title: 'Показать отделы',
        action: () => {
          showOtdels();
        },
      },
    ];

    const actionsArray: MenuActionProps[] = [
      ...actionsArray1,
      {
        title: 'Печатать этикетку',
        action: () => {
          navigation?.navigate('PrintCheckScreen', {
            item: CheckPalletsStore.curretElement,
          });
          CheckPalletsStore.curretElement = null;
        },
      },
      {title: 'Изменить статус', action: () => changeStatus()},
    ];

    const close: MenuActionProps[] = [
      {
        close: true,
        title: 'Закрыть',
        action: function () {
          CheckPalletsStore.curretElement = null;
        },
      },
    ];

    const createAlertForDelete = (curel: PalletInListCheck) => {
      Alert.alert('Внимание!', 'Удалить проверку №' + curel.ID + '?', [
        {
          onPress: () => {},
          text: 'Отмена',
        },
        {
          text: 'Удалить',
          onPress: () => {
            deleteCheck(curel);
          },
        },
      ]);
    };

    const deleteCheck = async (curel: PalletInListCheck) => {
      try {
        CheckPalletsStore.loading_list = true;
        const response = await PocketProvDelete({
          City: UserStore.user?.['city.cod'],
          NumNakl: curel?.ID,
          Type: CheckPalletsStore.Type,
          UID: UserStore.user?.UserUID,
        });
        if (response) {
          CheckPalletsStore.curretElement = null;
          CheckPalletsStore.get_list_of_items(CheckPalletsStore.filtershop);
        }
        console.log(response);
      } catch (error) {
        alertActions(error);
      } finally {
        CheckPalletsStore.loading_list = false;
      }
    };

    const animationState = useAnimationState({
      from: {
        translateX: 0,
      },
      to: {
        translateX: 0,
      },
      left: {
        translateX: -SCREEN_WIDTH * 0.9,
      },
    });

    return (
      <View
        style={{
          maxHeight: heignt,
          backgroundColor: BRIGHT_GREY,
          width: SCREEN_WIDTH * 0.9,
          borderRadius: 8,
        }}>
        <View
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}>
          <MotiView
            style={{width: SCREEN_WIDTH * 0.9 * 2, flexDirection: 'row'}}
            state={animationState}
            transition={{
              type: 'timing',
              duration: 300,
            }}>
            <View style={{width: SCREEN_WIDTH * 0.9, paddingHorizontal: 16}}>
              <View style={{height: 16}} />
              <WhiteCardForInfo>
                <TitleAndDiscribe
                  fontSize={14}
                  title={'Номер проверки'}
                  discribe={CheckPalletsStore.curretElement?.ID}
                />
                <TitleAndDiscribe
                  fontSize={14}
                  title={'Статус'}
                  discribe={CheckPalletsStore.curretElement?.Flag}
                />
                <TitleAndDiscribe
                  fontSize={14}
                  title={'Подразделение'}
                  discribe={CheckPalletsStore.curretElement?.CodShop}
                />
                <TitleAndDiscribe
                  fontSize={14}
                  title={'Отдел'}
                  discribe={CheckPalletsStore.curretElement?.CodDep}
                />
                <Text>
                  {CheckPalletsStore.curretElement?.Comment
                    ? CheckPalletsStore.curretElement?.Comment
                    : '---'}
                </Text>
              </WhiteCardForInfo>

              <View style={{height: 16}} />
              <MenuListComponent
                data={
                  CheckPalletsStore.Type === '7' ? actionsArray : actionsArray1
                }
              />
            </View>
            <View style={{width: SCREEN_WIDTH * 0.9, paddingHorizontal: 16}}>
              <View style={{height: 16}} />
              <TouchableOpacity
                style={{width: 40, height: 40, justifyContent: 'center'}}
                onPress={() => {
                  //setlistofDeps([]);
                  animationState.transitionTo('to');
                }}>
                <MaterialCommunityIcons name={'arrow-left'} size={20} />
              </TouchableOpacity>

              <WhiteCardForInfo
                style={{
                  backgroundColor: BRIGHT_GREY,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    width: '50%',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Отдел
                </Text>
                <Text
                  style={{
                    width: '50%',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Кол-во
                </Text>
              </WhiteCardForInfo>
              <Divider />

              {loadingotdels && listofDeps.length === 0 ? (
                <LoadingFlexComponent />
              ) : listofDeps.length > 0 ? (
                <ScrollView style={{maxHeight: SCREEN_WIDTH * 0.6}}>
                  {listofDeps.map((r, i) => (
                    <View key={i}>
                      <WhiteCardForInfo
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            width: '50%',
                            textAlign: 'center',
                          }}>
                          {r.CodDep}
                        </Text>
                        <Text
                          style={{
                            width: '50%',
                            textAlign: 'center',
                          }}>
                          {r.Qty}{' '}
                        </Text>
                      </WhiteCardForInfo>
                      <View style={{height: 8}} />
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={{alignSelf: 'center'}}>Список пуст</Text>
              )}
            </View>
          </MotiView>
          <View style={{height: 16}} />
        </View>
        <View style={{paddingHorizontal: 16}}>
          <MenuListComponent data={close} />
        </View>
        <View style={{height: 16}} />
      </View>
    );
  },
);

export default ProverkaTouchBottomSheet;

const styles = StyleSheet.create({
  filter: {
    width: '50%',
    justifyContent: 'center',
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
  inTouchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

const ProverkaTouchBottomSheetListElement = ({
  left,
  right,
}: {
  left: string;
  right: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 4,
        paddingVertical: 8,
        borderBottomWidth: 0.4,
      }}>
      <View style={[styles.filter, {borderRightWidth: 1}]}>
        <Text style={{fontWeight: 'bold'}}>{left}</Text>
      </View>

      <View style={[styles.filter, {}]}>
        <Text style={{fontWeight: 'bold'}}>{right}</Text>
      </View>
    </View>
  );
};
