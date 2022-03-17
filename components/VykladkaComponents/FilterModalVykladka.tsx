import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BACK_COLOR, SCREEN_WIDTH} from '../../constants/funcrions';
import {IFilter} from '../../hooks/VykladkaHooks/VykladkaStartHook';
import {CustomModalProps} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';
import CustomModalComponent from '../SystemComponents/CustomModalComponent';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import SizedBox from '../SystemComponents/SizedBox';
import WhiteTextInputWithButtonIcon from '../SystemComponents/WhiteTextInput';

const FilterModalVykladka = observer(
  (
    props: CustomModalProps & {
      getList: (filter: IFilter) => Promise<void>;
      currentFilter: IFilter;
    },
  ) => {
    const [filtercodshop, setfiltercodshop] = useState<string>(
      props.currentFilter.FilterShop ?? '',
    );
    const [filterUid, setfilterUid] = useState<string>(
      props.currentFilter.FilterUid ?? '',
    );
    const getlist = (txt = '') => {};

    const customref1 = useRef<TextInput>(null);
    const customref2 = useRef<TextInput>(null);

    useEffect(() => {
      setTimeout(() => customref1.current?.focus(), 150);
    }, []);

    return (
      <CustomModalComponent {...props}>
        <View
          style={{
            backgroundColor: BACK_COLOR,
            width: SCREEN_WIDTH * 0.8,
            borderRadius: 8,
            padding: 16,
          }}>
          <WhiteTextInputWithButtonIcon
            placeholder={''}
            keyboardType="number-pad"
            innerRef={customref1}
            // autoFocus={true}
            startText="Подр:"
            value={filtercodshop}
            setValue={setfiltercodshop}
            onIconPress={() => setfiltercodshop('')}
            onSubmitEditing={() => customref2.current?.focus()}
          />
          <SizedBox h={8} />
          <WhiteTextInputWithButtonIcon
            placeholder={''}
            autoFocus={false}
            innerRef={customref2}
            startText="Польз:"
            value={filterUid}
            setValue={setfilterUid}
            onIconPress={() => setfilterUid('')}
            onSubmitEditing={() => {
              props.setmodalVisible(false);
              props.getList({
                FilterShop: filtercodshop,
                FilterUid: filterUid,
              });
            }}
          />
          <SizedBox h={8} />

          <View style={{height: 8}} />
          <MenuListComponent
            data={[
              {
                action: () => {
                  props.setmodalVisible(false);
                  props.getList({
                    FilterShop: filtercodshop,
                    FilterUid: filterUid,
                  });
                },
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
      </CustomModalComponent>
    );
  },
);

export default FilterModalVykladka;

const styles = StyleSheet.create({});
