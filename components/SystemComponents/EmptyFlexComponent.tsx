import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const EmptyFlexComponent = ({text = ''}: {text?: string}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{text.length > 0 ? text : 'Список пуст'}</Text>
    </View>
  );
};

export default EmptyFlexComponent;

const styles = StyleSheet.create({});
