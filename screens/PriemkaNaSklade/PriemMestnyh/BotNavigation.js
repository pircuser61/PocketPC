import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  Vibration,
} from 'react-native';
import {MAIN_COLOR} from '../../../constants/funcrions';

const BotNavigation = ({
  leftName = '',
  leftOnPress = () => {},
  rightName = '',
  rightOnPress = () => {},
}) => {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 57,
          backgroundColor: 'black',
          width: '100%',
        }}></View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 56,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            Vibration.vibrate(100);
            leftOnPress();
          }}
          style={{
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#D1D1D1',
            height: 56,
            borderTopEndRadius: 0,
            borderTopStartRadius: 0,
          }}>
          <Text style={{fontSize: 16, color: '#000000', opacity: 0.8}}>
            {leftName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Vibration.vibrate(200);
            rightOnPress();
          }}
          style={{
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: MAIN_COLOR,
            height: 56,
            borderTopEndRadius: 0,
            borderTopStartRadius: 0,
          }}>
          <Text style={{fontSize: 16, color: '#FFFFFF', opacity: 0.8}}>
            {rightName}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default BotNavigation;
