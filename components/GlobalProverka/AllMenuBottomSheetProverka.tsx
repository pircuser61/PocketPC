import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BottomSheetProps} from '../../types/types';
import BottomSheetButtom from './BottomSheetButtom';

const AllMenuBottomSheetProverka = observer(
  ({heignt = 0}: BottomSheetProps) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          height: heignt,
        }}>
        <View style={{flex: 1}} />
        <BottomSheetButtom title={'Показать отделы'} />
        <BottomSheetButtom title={'Печатать этикетку'} />
      </View>
    );
  },
);

export default AllMenuBottomSheetProverka;

const styles = StyleSheet.create({});
