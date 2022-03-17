import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SCREEN_WIDTH} from '../../constants/funcrions';

const EmptyListComponent = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: SCREEN_WIDTH,
        height: '100%',
      }}>
      <Text>Список пуст...</Text>
    </View>
  );
};

export default EmptyListComponent;

const styles = StyleSheet.create({});
