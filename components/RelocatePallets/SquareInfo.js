import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const SquareInfo = ({data = '', title = ''}) => {
  return (
    <View
      style={{
        height: 70,
        width: 70,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginRight: 0,
        borderWidth: 0,
      }}>
      <Text style={{fontSize: 10, fontWeight: 'bold'}}>{title}:</Text>

      <Text style={{textAlign: 'center'}}>{data ? data : '---'}</Text>
    </View>
  );
};

export default SquareInfo;

const styles = StyleSheet.create({});
