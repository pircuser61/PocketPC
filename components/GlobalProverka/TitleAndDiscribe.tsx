import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  title?: string;
  discribe?: string;
  fontSize?: number;
  color?: string;
}

const TitleAndDiscribe = ({
  title = '',
  discribe = '',
  fontSize = 16,
  color,
}: Props) => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'flex-end', maxWidth: '90%'}}>
      <Text style={{fontSize: fontSize, fontWeight: 'bold', color: color}}>
        {title}:{' '}
      </Text>
      <Text style={{fontSize: fontSize, color: color}}>
        {discribe ? discribe : '---'}
      </Text>
    </View>
  );
};

export default TitleAndDiscribe;

const styles = StyleSheet.create({});
