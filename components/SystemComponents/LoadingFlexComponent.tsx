import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const LoadingFlexComponent = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={26} color={MAIN_COLOR} />
    </View>
  );
};

export default LoadingFlexComponent;

const styles = StyleSheet.create({});
