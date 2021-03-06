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
import {CustomModalProps, ProvPalSpecsRow} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';
import Feather from 'react-native-vector-icons/Feather';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import {PocketProvGoodsSet} from '../../functions/PocketProvGoodsSet';
import UserStore from '../../mobx/UserStore';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import TitleAndDiscribe from '../GlobalProverka/TitleAndDiscribe';
import {GoodsRow} from '../../functions/PocketPlanGoodsGet';
import {PocketPlanGoodsQty} from '../../functions/PocketPlanGoodsQty';

const ChangeCoodQtyPlanogramma = observer(
  (
    props: CustomModalProps & {
      mode: '-1' | '0' | '1' | null;
      item: GoodsRow & {NumPlan: string};
      goodInfo: GoodsRow;
      setGoodInfo: (goodInfo: GoodsRow | null) => void;
    },
  ) => {
    const [newQty, setnewQty] = useState('');
    const [loading, setloading] = useState(false);
    const {mode, item, goodInfo} = props;
    const customref = useRef<TextInput>(null);
    useEffect(() => {
      setTimeout(() => customref.current?.focus(), 50);
    }, []);

    const changeQty = async () => {
      if (newQty.replaceAll(' ', '').length === 0) props.setmodalVisible(false);
      else {
        try {
          setloading(true);
          const response = await PocketPlanGoodsQty({
            City: UserStore.user?.['city.cod'],
            UID: UserStore.user?.UserUID,
            Cmd: mode ? mode : '',
            Qty: newQty,
            CodGood: item.CodGood,
            ByCennic: item.ByCennic,
            NumPlan: item.NumPlan,
          });
          props.setGoodInfo({...goodInfo, Qty: response.Qty});
          props.setmodalVisible(false);
        } catch (error) {
          alertActions(error);
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
                ? '???????????????? ??????-????'
                : mode === '1'
                ? '??????????????????'
                : mode === '-1'
                ? '????????????'
                : ''}
            </Text>
          </WhiteCardForInfo>
          <View style={{height: 8}} />
          <WhiteCardForInfo>
            <TitleAndDiscribe
              title={'?????????????????????? ??????-????'}
              discribe={goodInfo?.Qty}
            />
            <TitleAndDiscribe
              title={'??????????????'}
              discribe={String(goodInfo.ShopQty)}
            />
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
                  ? '????????????????'
                  : mode === '1'
                  ? '??????????????????'
                  : mode === '-1'
                  ? '????????????'
                  : '') + ' ??????-????...'
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
                    ? '??????????????'
                    : mode === '0'
                    ? '???????????????? ??????-????'
                    : mode === '1'
                    ? '??????????????????'
                    : mode === '-1'
                    ? '????????????'
                    : '',
              },
            ]}
          />
          {/* <InputField
            value={newQty}
            setValue={setnewQty}
            padding={0}
            isTextInput={mode === null ? false : true}
            needIcon={false}
            placeholder={
              (mode === '0'
                ? '????????????????'
                : mode === '1'
                ? '??????????????????'
                : mode === '-1'
                ? '????????????'
                : '') + ' ??????-????...'
            }
          /> */}
        </View>
      </ModalTemplate>
    );
  },
);

export default ChangeCoodQtyPlanogramma;

const styles = StyleSheet.create({});
