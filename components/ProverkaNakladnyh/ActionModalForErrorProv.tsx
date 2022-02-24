import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, ReactNode} from 'react';
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
import {NakladProvProps} from '../../screens/ProverkaNakladnyh/ProverkaNakladnyhStart';
import {
  CustomModalProps,
  PocketProvperReportProps,
  ProvperRow,
} from '../../types/types';
import TitleAndDiscribe from '../GlobalProverka/TitleAndDiscribe';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import MenuListComponent from '../SystemComponents/MenuListComponent';

const ActionModalForErrorProv = observer(
  (
    props: CustomModalProps & {
      prov: ProvperRow;
      setchossen: (numprov: string) => void;
      MenuInModal: (item: {prov: ProvperRow}) => React.ReactElement;
    } & NakladProvProps,
  ) => {
    const {MenuInModal} = props;
    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BACK_COLOR,
            width: SCREEN_WIDTH * 0.7,
            borderRadius: 8,
            padding: 16,
          }}>
          <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
            Проверка с ошибкой №{props.prov.NumProv}
          </Text>

          <View style={{height: 8}} />
          <MenuInModal prov={props.prov} />
          <View style={{height: 8}} />
          <MenuListComponent
            data={[
              {
                action: () => props.setmodalVisible(false),
                title: 'Закрыть окно',
                close: true,
              },
            ]}
          />
        </View>
      </ModalTemplate>
    );
  },
);

export default ActionModalForErrorProv;
