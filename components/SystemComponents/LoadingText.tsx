import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BRIGHT_GREY, MAIN_COLOR, SCREEN_WIDTH} from '../../constants/funcrions';

const LoadingText = ({visible = false}) => {
  return visible ? (
    <View
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        width: SCREEN_WIDTH,
        alignItems: 'center',
        zIndex: 1000,
      }}>
      <Text style={{color: MAIN_COLOR}}>Идет загрузка...</Text>
    </View>
  ) : null;
};

export default LoadingText;

const styles = StyleSheet.create({});
