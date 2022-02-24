import {MotiView} from '@motify/components';
import {useAnimationState} from '@motify/core';
import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  alertActions,
  BRIGHT_GREY,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {CustomModalProps, GoodsRow} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import ModalHeader from '../SystemComponents/ModalHeader';
import TitleAndDiscribe from './TitleAndDiscribe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PocketProvGoodsSet} from '../../functions/PocketProvGoodsSet';
import UserStore from '../../mobx/UserStore';

const ChangeQtyInCheckModal = observer(
  (
    props: CustomModalProps & {
      item: GoodsRow | null;
      changeQty: ({
        mode,
        Qty,
      }: {
        mode: '-1' | '0' | '1' | null;
        Qty: string;
      }) => Promise<PocketProvGoodsSet>;
    },
  ) => {
    const [mode, setMode] = useState<'-1' | '0' | '1' | null>(null);

    const [newQty, setnewQty] = useState('0');
    const animationState = useAnimationState({
      from: {
        translateX: 0,
      },
      to: {
        translateX: 0,
      },
      left: {
        translateX: -SCREEN_WIDTH * 0.7,
      },
    });

    const pressChange = async () => {
      try {
        const res = await props.changeQty({mode, Qty: newQty});
        console.log(res);
      } catch (error) {
        alertActions(error);
      }
    };

    const actions = [
      {
        title: 'Прибавить',
        action: () => {
          setMode('1');
        },
        needChevrone: true,
      },
      {
        title: 'Отнять',
        action: () => {
          setMode('-1');
        },
        needChevrone: true,
      },
      {
        title: 'Изменить количество',
        action: () => {
          setMode('0');
        },
        needChevrone: true,
      },
    ];

    useEffect(() => {
      switch (mode) {
        case '1':
          setnewQty('0');
          animationState.transitionTo('left');
          break;
        case '-1':
          setnewQty('0');
          animationState.transitionTo('left');
          break;
        case '0':
          setnewQty(props.item?.QtyFact ?? '0');
          animationState.transitionTo('left');
          break;
        default:
          animationState.transitionTo('to');
          break;
      }
    }, [mode]);
    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: 'white',
            width: SCREEN_WIDTH * 0.7,
            borderRadius: 8,
          }}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 8,
            }}>
            <MotiView
              style={{width: SCREEN_WIDTH * 0.7 * 2, flexDirection: 'row'}}
              state={animationState}
              transition={{
                type: 'timing',
                duration: 200,
              }}>
              <View style={{width: SCREEN_WIDTH * 0.7, paddingHorizontal: 16}}>
                <View style={{height: 36}} />

                <MenuListComponent data={actions} />
              </View>
              <View style={{width: SCREEN_WIDTH * 0.7, paddingHorizontal: 16}}>
                <View style={{height: 16}} />
                <TouchableOpacity
                  style={{width: 40, height: 40, justifyContent: 'center'}}
                  onPress={() => {
                    setMode(null);
                  }}>
                  <MaterialCommunityIcons name={'arrow-left'} size={20} />
                </TouchableOpacity>
                <View style={{height: 16}} />
                <TitleAndDiscribe
                  title={'Нужное кол-во'}
                  discribe={props.item?.QtyDoc}
                />
                <TitleAndDiscribe
                  title={'Фактическое кол-во'}
                  discribe={props.item?.QtyFact}
                />
                <TitleAndDiscribe
                  title={'Разница'}
                  discribe={String(
                    Number(props.item?.QtyFact) - Number(props.item?.QtyDoc),
                  )}
                />
                <InputField
                  value={newQty}
                  setValue={setnewQty}
                  padding={0}
                  isTextInput={mode === null ? false : true}
                  needIcon={false}
                  title={
                    mode === '0'
                      ? 'Изменить кол-во'
                      : mode === '1'
                      ? 'Прибавить'
                      : mode === '-1'
                      ? 'Отнять'
                      : ''
                  }
                  placeholder={
                    (mode === '0'
                      ? 'Изменить'
                      : mode === '1'
                      ? 'Прибавить'
                      : mode === '-1'
                      ? 'Отнять'
                      : '') + ' кол-во...'
                  }
                />
                <View style={{height: 16}} />
                <MenuListComponent
                  data={[
                    {
                      readyMark: true,
                      title:
                        mode === '0'
                          ? 'Изменить'
                          : mode === '1'
                          ? 'Прибавить'
                          : mode === '-1'
                          ? 'Отнять'
                          : '',
                      action: () => {
                        pressChange();
                      },
                    },
                  ]}
                />
              </View>
            </MotiView>
          </View>

          <View style={{paddingHorizontal: 16}}>
            <View style={{height: 16}} />
            <MenuListComponent
              data={[
                {
                  close: true,
                  title: 'Закрыть',
                  action: () => {
                    props.setmodalVisible(false);
                  },
                },
              ]}
            />
            <View style={{height: 16}} />
          </View>
        </View>
      </ModalTemplate>
    );
  },
);

export default ChangeQtyInCheckModal;

const styles = StyleSheet.create({});
