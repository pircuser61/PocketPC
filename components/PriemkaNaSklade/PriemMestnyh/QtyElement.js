import React from 'react';
import { Text, View } from 'react-native';

const QtyElement = ({keyName, valueName}) => (
  <View style={{alignItems:'center'}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>{keyName}</Text>
    <Text style={{fontSize:16}}>{valueName?valueName:0}</Text>
  </View>
);

export default QtyElement;
