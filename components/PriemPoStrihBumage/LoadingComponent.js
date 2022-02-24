import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const LoadingComponent = () => {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 200,
      }}>
      <ActivityIndicator size={'large'} color={MAIN_COLOR} />
    </View>
  );
};

export default LoadingComponent;
