import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TitleAndDiscribe from './TitleAndDiscribe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_WIDTH} from '../../constants/funcrions';
import {GoodsRow} from '../../types/ProverkaTypes';

export const FirstCell = (props: GoodsRow | null) => {
  return (
    <View style={{padding: 16}}>
      <TitleAndDiscribe title={'Артикул'} discribe={props?.Art} />
      <Text style={{fontSize: 16}}>{props?.DepName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export const SecondCell = (props: GoodsRow | null) => {
  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 16}}>{props?.KatName}</Text>
      <TitleAndDiscribe
        title={'Цена'}
        discribe={Number(props?.Price ?? 0).toFixed(3)}
      />
      <TitleAndDiscribe title={'Предыдущее кол-во'} discribe={props?.QtyUndo} />
    </View>
  );
};

export const QtyCell = (props: GoodsRow | null) => {
  return (
    <View
      style={{
        padding: 16,

        justifyContent: 'center',
      }}>
      <TitleAndDiscribe
        title={'Нужное кол-во'}
        discribe={Number(props?.QtyDoc ?? 0).toFixed(3)}
      />
      <TitleAndDiscribe
        title={'Фактическое кол-во'}
        discribe={Number(props?.QtyFact ?? 0).toFixed(3)}
      />
      <TitleAndDiscribe
        title={'Разница'}
        discribe={String(Number(props?.QtyFact) - Number(props?.QtyDoc))}
      />
    </View>
  );
};
