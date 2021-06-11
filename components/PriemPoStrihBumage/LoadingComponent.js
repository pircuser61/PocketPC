import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

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
      <ActivityIndicator size={'large'} color={'#313C47'} />
    </View>
  );
};

export default LoadingComponent;
