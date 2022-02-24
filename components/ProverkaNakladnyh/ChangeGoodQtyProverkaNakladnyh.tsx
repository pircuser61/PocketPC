import {observer} from 'mobx-react-lite';
import {Box} from 'native-base';
import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import {
  CustomModalProps,
  ProvPalSpecsRow,
  ProvperGoodsRow,
} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';
import TitleAndDiscribe from '../GlobalProverka/TitleAndDiscribe';
import Feather from 'react-native-vector-icons/Feather';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import {PocketProvGoodsSet} from '../../functions/PocketProvGoodsSet';
import UserStore from '../../mobx/UserStore';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {GoodsRow} from '../../types/ProverkaTypes';
import {PocketProvperGoodsSet} from '../../functions/PocketProvperGoodsSet';

const ChangeGoodQtyProverkaNakladnyh = observer(
  (
    props: CustomModalProps & {
      mode: '-1' | '0' | '1';
      item: ProvperGoodsRow & {NumProv?: string; NumNakl?: string};
      changeQty: (item: {IdNum: string; Qty: string}) => void;
    },
  ) => {
    const [newQty, setnewQty] = useState('');
    const [loading, setloading] = useState(false);
    const {mode, item} = props;
    const customref = useRef<TextInput>(null);
    useEffect(() => {
      setTimeout(() => customref.current?.focus(), 50);
    }, []);

    const changeQty = async () => {
      if (newQty.replaceAll(' ', '').length === 0) props.setmodalVisible(false);
      else {
        try {
          setloading(true);
          const response = await PocketProvperGoodsSet({
            City: UserStore.user?.['city.cod'],
            UID: UserStore.user?.UserUID,
            Cmd: mode,
            IdNum: item.IdNum,
            NumNakl: item.NumNakl,
            NumProv: item.NumProv,
            Qty: newQty,
          });
          props.changeQty(response);
          props.setmodalVisible(false);
        } catch (error) {
          alertActions(error);
          customref.current?.focus();
          setloading(false);
        }
      }
    };

    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BRIGHT_GREY,
            borderRadius: 8,
            padding: 16,
            width: SCREEN_WIDTH * 0.8,
          }}>
          <WhiteCardForInfo>
            <Text
              style={{fontSize: 16, alignSelf: 'center', fontWeight: 'bold'}}>
              {mode === '0'
                ? 'Изменить кол-во'
                : mode === '1'
                ? 'Прибавить'
                : mode === '-1'
                ? 'Отнять'
                : ''}
            </Text>
          </WhiteCardForInfo>
          <View style={{height: 8}} />
          <WhiteCardForInfo>
            <TitleAndDiscribe title={'Нужное кол-во'} discribe={item.QtyNakl} />
            <TitleAndDiscribe
              title={'Фактическое кол-во'}
              discribe={item.QtyFact}
            />
            <TitleAndDiscribe
              title={'Разница'}
              discribe={String(Number(item.QtyFact) - Number(item.QtyNakl))}
            />
            <TitleAndDiscribe title={'Код товара'} discribe={item.CodGood} />
          </WhiteCardForInfo>
          <View style={{height: 8}} />
          <WhiteCardForInfo
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              onSubmitEditing={() => changeQty()}
              ref={customref}
              style={{borderRadius: 8, width: '70%'}}
              onChangeText={setnewQty}
              value={newQty}
              placeholder={
                (mode === '0'
                  ? 'Изменить'
                  : mode === '1'
                  ? 'Прибавить'
                  : mode === '-1'
                  ? 'Отнять'
                  : '') + ' кол-во...'
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                {
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => setnewQty('')}>
              <Feather name="trash-2" size={20} color="black" />
            </TouchableOpacity>
          </WhiteCardForInfo>
          <View style={{height: 16}} />
          <MenuListComponent
            data={[
              {
                loading: loading,
                readyMark:
                  newQty.replaceAll(' ', '').length === 0 ? false : true,
                close: newQty.replaceAll(' ', '').length === 0 ? true : false,
                action: changeQty,
                title:
                  newQty.replaceAll(' ', '').length === 0
                    ? 'Закрыть'
                    : mode === '0'
                    ? 'Изменить кол-во'
                    : mode === '1'
                    ? 'Прибавить'
                    : mode === '-1'
                    ? 'Отнять'
                    : '',
              },
            ]}
          />
        </View>
      </ModalTemplate>
    );
  },
);

export default ChangeGoodQtyProverkaNakladnyh;

const styles = StyleSheet.create({});
