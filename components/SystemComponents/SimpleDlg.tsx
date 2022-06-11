import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import SimpleButton from '../../components/SystemComponents/SimpleButton';

const SimpleDlg = ({
  onSubmit,
  onCancel,
  active = true,
  children = null,
}: {
  onSubmit?: () => void;
  onCancel?: () => void;
  active?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Modal transparent={true}>
      <View style={styles.shadowView}>
        <View style={styles.whiteView}>
          {children}
          <View style={styles.buttonsView}>
            {onSubmit ? (
              <SimpleButton
                text="Ок"
                containerStyle={styles.buttonStyle}
                onPress={onSubmit}
                active={active}
              />
            ) : null}
            {onCancel ? (
              <SimpleButton
                text="Отмена"
                containerStyle={styles.buttonStyle}
                onPress={onCancel}
                active={active}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleDlg;

const styles = StyleSheet.create({
  buttonStyle: {width: 120, alignItems: 'center'},

  whiteView: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    width: 360,
    position: 'absolute',
    top: 90,
    flex: 1,
  },
  shadowView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  buttonsView: {flexDirection: 'row', justifyContent: 'space-evenly'},
});
