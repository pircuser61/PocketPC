import React from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const ButtonBot = ({disabled = true, onPress = () => {}, title = ''}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        height: 48,
        justifyContent: 'center',
        zIndex: 100,
        opacity: 1,
        backgroundColor: disabled ? 'darkgrey' : MAIN_COLOR,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
      }}
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}>
      <Text
        style={{
          color: disabled ? 'grey' : 'white',
          fontWeight: 'bold',
          fontSize: 14,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonBot;

const styles = StyleSheet.create({});
