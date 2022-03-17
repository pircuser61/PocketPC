import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

export const PressBotBar = ({
  onPress = () => {},
  title = '',
  width = '100%',
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  width?: string;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        height: 48,
        justifyContent: 'center',
        zIndex: 100,
        backgroundColor: MAIN_COLOR,
        alignItems: 'center',
        width: width,
      }}
      onPress={onPress}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PressBotBar;

const styles = StyleSheet.create({});
