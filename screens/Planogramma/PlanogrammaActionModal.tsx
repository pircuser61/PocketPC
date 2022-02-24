import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, ReactNode} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Title} from 'react-native-paper';
import ModalTemplate from '../../components/ModalTemplate';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import {
  alertActions,
  BACK_COLOR,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TOGGLE_SCANNING,
} from '../../constants/funcrions';
import {Plan} from '../../functions/PocketPlanGet';
import {PocketProvperReport} from '../../functions/PocketProvperReport';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {NakladProvProps} from '../../screens/ProverkaNakladnyh/ProverkaNakladnyhStart';
import {
  CustomModalProps,
  PocketProvperReportProps,
  ProvperRow,
} from '../../types/types';

const PlanogrammaActionModal = observer(
  (
    props: CustomModalProps & {
      prov: Plan;
      MenuInModal: (item: {prov: Plan}) => React.ReactElement;
    },
  ) => {
    const {MenuInModal} = props;
    return (
      <ModalTemplate {...props}>
        <View
          style={{
            backgroundColor: BACK_COLOR,
            width: SCREEN_WIDTH * 0.8,
            borderRadius: 8,
            padding: 16,
          }}>
          <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
            Планограмма с ошибкой №{props.prov.NumPlan}
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

export default PlanogrammaActionModal;
