import React from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const ButtonBot = ({disabled = true, onPress = () => {}, title = ''}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        height: 48,
        justifyContent: 'center',
        zIndex: 100,
        backgroundColor: '#313C47',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
      }}
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}>
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonBot;

const styles = StyleSheet.create({});
