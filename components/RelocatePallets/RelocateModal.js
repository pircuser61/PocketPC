import * as React from 'react';
import {Keyboard, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Modal, Portal, Text, Button, Provider} from 'react-native-paper';

const RelocateModal = ({visible, setVisible}) => {
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          dismissable={false}
          contentContainerStyle={{
            alignItems: 'center',
            height: '80%',
            backgroundColor: '#e3e3e3',
            width: '92%',
            alignSelf: 'center',
            borderRadius: 8,
          }}>
          <TextInput />
        </Modal>
      </Portal>
    </TouchableWithoutFeedback>
  );
};

export default RelocateModal;
