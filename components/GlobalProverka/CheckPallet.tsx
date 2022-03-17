import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProverkaListElement from './ProverkaListElement';
import TitleAndDiscribe from './TitleAndDiscribe';

interface Props {}

const CheckPallet = ({}: Props) => {
  return (
    <View style={{borderBottomWidth: 0.4}}>
      <View style={{height: 40}}></View>
      <View
        style={{
          height: 60,
          //backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <TitleAndDiscribe title={'Сектор'} discribe={''} />
          <TitleAndDiscribe title={'Этаж'} discribe={''} />
          <TitleAndDiscribe title={'Номер'} discribe={''} />
          <TitleAndDiscribe title={'Стелаж'} discribe={''} />
        </View>
      </View>
    </View>
  );
};

export default CheckPallet;

const styles = StyleSheet.create({});

interface PlaceElementProps {
  left?: string;
  right?: string;
}

const PlaceElement = (props: PlaceElementProps) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text>{props.left}: </Text>
      <Text style={{width: 40}}>{props.right}</Text>
    </View>
  );
};

//Сектор
//Этаж
//Номер
//Стелаж
