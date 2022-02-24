import {observer} from 'mobx-react-lite';
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
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

const ModalForSearchPodrazd = observer((props: CustomModalProps) => {
  const [filtertext, setFilterText] = useState<string>('');
  const getlist = async (txt: string) => {
    try {
      props.setmodalVisible(false);
      await CheckPalletsStore.get_list_of_items(txt);
    } catch (error) {
      alertActions(error);
    }
  };

  const customref = useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => customref.current?.focus(), 150);
  });

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
          innerRef={customref}
          title={'Текущий фильтр'}
          placeholder={'Введите код под. или об.'}
          titleval={CheckPalletsStore.filtershop}
          iconName={'home-search'}
          autofocus={false}
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
              action: () => getlist(UserStore.podrazd.Id),
              title: 'Показать текущий',
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
});

export default ModalForSearchPodrazd;
