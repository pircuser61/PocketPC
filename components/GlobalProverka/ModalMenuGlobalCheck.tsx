import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SCREEN_HEIGHT} from '../../constants/funcrions';
import {CustomModalProps} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import ProverkaTouchBottomSheet from './ProverkaTouchBottomSheet';

const ModalMenuGlobalCheck = observer((props: CustomModalProps) => {
  return (
    <ModalTemplate {...props}>
      <ProverkaTouchBottomSheet {...props} heignt={SCREEN_HEIGHT * 0.6} />
    </ModalTemplate>
  );
});

export default ModalMenuGlobalCheck;

const styles = StyleSheet.create({});
