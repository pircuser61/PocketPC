import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {MAIN_COLOR, SCREEN_WIDTH} from '../../constants/funcrions';
import {PocketPalPlaceGet} from '../../functions/PocketPalPlaceGet';
import UserStore from '../../mobx/UserStore';
import {
  CustomModalProps,
  PalletInfoProps,
  ProvPalSpecsRow,
} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import TitleAndDiscribe from './TitleAndDiscribe';

const ModalForShowPalletInfo = observer(
  (
    props: CustomModalProps &
      ProvPalSpecsRow & {
        NumNakl: string;
      },
  ) => {
    const [palletInfo, setpalletInfo] = useState<PalletInfoProps | null>(null);
    const [loading, setLoading] = useState(true);

    const getPalletInfo = async (palletNum = '') => {
      try {
        setLoading(true);
        const response = await PocketPalPlaceGet({
          NumPal: palletNum,
          SkipShop: 'true',
          City: UserStore.user?.['city.cod'],
          UID: UserStore.user?.UserUID,
        });
        setpalletInfo(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getPalletInfo(props.NumDoc);
    }, []);

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
              padding: 16,
            }}>
            <View
              style={{
                height: 240,
                justifyContent: 'center',
                //alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator
                  size={32}
                  color={MAIN_COLOR}
                  style={{alignSelf: 'center'}}
                />
              ) : (
                <>
                  <TitleAndDiscribe
                    title={'Паллета'}
                    discribe={palletInfo?.NumPal}
                  />
                  <TitleAndDiscribe
                    title={'Об-ние'}
                    discribe={palletInfo?.CodShop}
                  />
                  <TitleAndDiscribe
                    title={'Подр.'}
                    discribe={palletInfo?.CodOb}
                  />
                  <TitleAndDiscribe
                    title={'Отдел'}
                    discribe={palletInfo?.CodDep}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginVertical: 8,
                      fontWeight: 'bold',
                    }}>
                    Размещение
                  </Text>
                  <TitleAndDiscribe
                    title={'Сектор'}
                    discribe={palletInfo?.Sector}
                  />
                  <TitleAndDiscribe
                    title={'Стелаж'}
                    discribe={palletInfo?.Rack}
                  />
                  <TitleAndDiscribe
                    title={'Этаж'}
                    discribe={palletInfo?.Floor}
                  />
                  <TitleAndDiscribe
                    title={'Номер'}
                    discribe={palletInfo?.Place}
                  />
                </>
              )}
            </View>

            <View style={{height: 8}} />
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
        </View>
      </ModalTemplate>
    );
  },
);

export default ModalForShowPalletInfo;

const styles = StyleSheet.create({});
