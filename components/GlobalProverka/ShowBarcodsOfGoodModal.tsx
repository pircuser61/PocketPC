import {observer} from 'mobx-react-lite';
import {Box} from 'native-base';
import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BRIGHT_GREY,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import {
  BarCodRow,
  BottomMenuCheckBarProps,
  CustomModalProps,
  GoodsRow,
  ProvPalSpecsRow,
} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';
import TitleAndDiscribe from './TitleAndDiscribe';
import Feather from 'react-native-vector-icons/Feather';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import {PocketProvGoodsSet} from '../../functions/PocketProvGoodsSet';
import UserStore from '../../mobx/UserStore';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {PocketProvGoodsGet} from '../../functions/PocketProvGoodsGet';
import LoadingFlexComponent from '../SystemComponents/LoadingFlexComponent';
import EmptyListComponent from '../SystemComponents/EmptyListComponent';
import ErrorAndUpdateComponent from '../SystemComponents/ErrorAndUpdateComponent';

const ShowBarcodsOfGoodModal = observer(
  (props: CustomModalProps & BottomMenuCheckBarProps) => {
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);
    const [list, setList] = useState<BarCodRow[]>([]);

    const {getNext, getPrev, goodInfo, relativePosition, item} = props;

    const getList = async () => {
      try {
        setloading(true);
        const response = await PocketProvGoodsGet({
          CodGood: goodInfo?.CodGood,
          IdNum: goodInfo?.IdNum,
          Cmd: 'curr',
          City: UserStore.user?.['city.cod'],
          DisplayMode: 'barcod',
          NumDoc: item.NumDoc,
          NumNakl: item.NumNakl,
          Type: CheckPalletsStore.Type,
          UID: UserStore.user?.UserUID,
        });
        setList(response as BarCodRow[]);
        //setList([]);
      } catch (error) {
        setError(error + '');
      } finally {
        setloading(false);
      }
    };

    useEffect(() => {
      getList();
    }, []);

    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BRIGHT_GREY,
            borderRadius: 8,
            padding: 16,
            width: SCREEN_WIDTH * 0.9,
          }}>
          <Text style={{fontSize: 16, alignSelf: 'center', fontWeight: 'bold'}}>
            Список баркодов
          </Text>
          <View style={{height: 16}} />
          <WhiteCardForInfo
            style={{
              backgroundColor: BRIGHT_GREY,
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
            <Text
              style={{
                width: SCREEN_WIDTH * 0.2,
                textAlign: 'right',
                fontWeight: 'bold',
              }}>
              КЦ
            </Text>
          </WhiteCardForInfo>
          <View style={{height: 8}} />
          <View style={{height: SCREEN_HEIGHT * 0.4}}>
            {loading ? (
              <LoadingFlexComponent />
            ) : error.length > 0 ? (
              <ErrorAndUpdateComponent error={error} update={getList} />
            ) : list.length > 0 ? (
              <ScrollView>
                {list.map((r, i) => (
                  <View key={i}>
                    <WhiteCardForInfo
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={{width: SCREEN_WIDTH * 0.35}}>{r.Cod}</Text>
                      <Text
                        style={{
                          width: SCREEN_WIDTH * 0.2,
                          textAlign: 'center',
                        }}>
                        {Number(r.Quant).toFixed(3)}
                      </Text>
                      <Text
                        style={{
                          width: SCREEN_WIDTH * 0.2,
                          textAlign: 'right',
                        }}>
                        {r.CodLevel}
                      </Text>
                    </WhiteCardForInfo>
                    <View style={{height: 8}} />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <EmptyListComponent />
            )}
          </View>
          <View style={{height: 16}} />
          <MenuListComponent
            data={[
              {
                action: () => {
                  props.setmodalVisible(false);
                },
                title: 'Закрыть',
                icon: 'close',
              },
            ]}
          />
        </View>
      </ModalTemplate>
    );
  },
);

export default ShowBarcodsOfGoodModal;

const styles = StyleSheet.create({});

/**
 & {
      mode: '-1' | '0' | '1' | null;
      item: ProvPalSpecsRow & {NumNakl: 'string'};
      goodInfo: GoodsRow;
      setGoodInfo: (goodInfo: GoodsRow | null) => void;
    }, */
