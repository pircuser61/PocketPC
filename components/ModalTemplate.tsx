import React, {useState, useEffect} from 'react';
import {
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import {CustomModalProps} from '../types/types';

const ModalTemplate = ({
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

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      style={{margin: 0}}
      onRequestClose={() => {
        setmodalVisible(!visible);
      }}>
      <View style={styles.centeredView}>{children}</View>
    </Modal>
  );
};

export default ModalTemplate;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
