import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CustomModalProps} from '../../types/types';

const CustomModalComponent = ({
  visible = false,
  setmodalVisible = () => {},
  children = null,
}: CustomModalProps) => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    const backAction = () => {
      setmodalVisible(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      backHandler.remove();
    };
  }, []);
  return (
    <Pressable
      onPress={() => {
        if (keyboardStatus) {
          Keyboard.dismiss();
        } else setmodalVisible(false);
      }}
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 4000,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        //backgroundColor: 'grey',
      }}>
      {children}
    </Pressable>
  );
};

export default CustomModalComponent;

const styles = StyleSheet.create({});
