import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  alertActions,
  BACK_COLOR,
  MAIN_COLOR,
  SCREEN_WIDTH,
  TOGGLE_SCANNING,
} from '../../constants/funcrions';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {CustomModalProps} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import MenuListComponent from '../SystemComponents/MenuListComponent';

const ProverkaFilterModal = observer(
  (
    props: CustomModalProps & {
      getList: (filterShop: string) => Promise<void>;
      currentfilter: string;
    },
  ) => {
    const [filtertext, setFilterText] = useState<string>(props.currentfilter);
    const [loading, setloading] = useState(false);
    const getlist = async (txt: string) => {
      try {
        await props.getList(txt);
        props.setmodalVisible(false);
      } catch (error) {
        alertActions(error);
      }
    };

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
            title={'Текущий фильтр'}
            placeholder={'Введите код магазина'}
            titleval={props.currentfilter}
            iconName={'home-search'}
            onIconPress={() => getlist(filtertext)}
            value={filtertext}
            padding={0}
            titleColor={'black'}
            setValue={(txt: string) => setFilterText(txt)}
            onChangeText={() => {}}
            isTextInput={true}
            onSubmit={() => {
              getlist(filtertext);
            }}
          />
          <View style={{height: 8}} />
          <MenuListComponent
            data={[
              {
                action: () => getlist(''),
                title: 'Показать все',
                icon: 'profile',
              },
              {
                action: () => getlist(filtertext),
                title: 'Поиск',
                icon: 'profile',
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
  },
);

export default ProverkaFilterModal;
