import React from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {SCREEN_WIDTH} from '../../constants/funcrions';
import {PalletInListCheck} from '../../types/types';

const ProverkaListElement = ({
  CodDep = '',
  CodShop = '',
  Flag = '',
  ID = '',
  UID = '',
  Comment = '',
  id = 0,
}: PalletInListCheck) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        height: 60,
        borderBottomWidth: 0.4,
        paddingHorizontal: 8,
      }}>
      <View
        style={{
          //justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderRadius: 8,
        }}>
        <RowElement width={0.04} text={Flag} />
        <RowElement width={0.2} text={ID} />
        <RowElement
          width={0.3}
          text={
            Comment.length > 13 ? Comment.substring(0, 12) + '...' : Comment
          }
        />
        <RowElement width={0.1} text={CodDep} />
        <RowElement width={0.1} text={CodShop} />
        <RowElement
          width={0.16}
          style={{justifyContent: 'flex-end'}}
          text={UID}
        />
      </View>
    </View>
  );
};

export default ProverkaListElement;

export const RowElement = ({
  width = 0,
  style = {},
  text = '',
  textStyle = {},
}: {
  width?: number;
  style?: object | ViewStyle;
  textStyle?: object | TextStyle;
  text?: string;
}) => {
  return (
    <View
      style={{
        //backgroundColor: 'grey',
        flexDirection: 'row',
        width: SCREEN_WIDTH * width,
        ...style,
        justifyContent: 'center',
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text
          numberOfLines={1}
          style={[
            {
              fontWeight: 'bold',
              alignSelf: 'center',
            },
            textStyle,
          ]}>
          {text ? text : '---'}
        </Text>
      </View>
    </View>
  );
};
