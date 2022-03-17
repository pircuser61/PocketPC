import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Title} from 'react-native-paper';
import {
  alertActions,
  BACK_COLOR,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TOGGLE_SCANNING,
} from '../../constants/funcrions';
import {PocketProvperReport} from '../../functions/PocketProvperReport';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {CustomModalProps, PocketProvperReportProps} from '../../types/types';
import TitleAndDiscribe from '../GlobalProverka/TitleAndDiscribe';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import MenuListComponent from '../SystemComponents/MenuListComponent';

const ProverkaOtchetModal = observer(
  (
    props: CustomModalProps & {
      numProv: string;
    },
  ) => {
    const [filtertext, setFilterText] = useState<string>(props.numProv);
    const [loading, setloading] = useState(false);
    const [status, setstatus] = useState<null | PocketProvperReportProps>(null);
    const getInfo = async () => {
      try {
        setloading(true);
        const response = await PocketProvperReport({
          City: UserStore.user?.['city.cod'],
          NumProv: props.numProv,
          UID: UserStore.user?.UserUID,
        });
        setstatus(response);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    useEffect(() => {
      getInfo();
    }, []);

    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BACK_COLOR,
            width: SCREEN_WIDTH * 0.6,
            borderRadius: 8,
            padding: 16,
          }}>
          <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
            Проверка №{props.numProv}
          </Text>
          <View
            style={{
              height: SCREEN_HEIGHT * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size={26} color={MAIN_COLOR} />
            ) : (
              <View style={{alignSelf: 'flex-start'}}>
                <TitleAndDiscribe
                  title={'< ? >'}
                  discribe={status?.EmptyFact}
                />
                <TitleAndDiscribe title={'<  >'} discribe={status?.EmptyPer} />
                <TitleAndDiscribe title={'< - >'} discribe={status?.HasDiff} />
                <TitleAndDiscribe title={'< + >'} discribe={status?.Ok} />
              </View>
            )}
          </View>
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
  },
);

export default ProverkaOtchetModal;
