import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const ModalHeader = ({title}: {title: string}) => {
  return (
    <View
      style={{
        borderBottomWidth: 0.4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{margin: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>{title}</Text>
      </View>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({});
