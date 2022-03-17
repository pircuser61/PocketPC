import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import HeaderPriemka from '../PriemkaNaSklade/Header';

const ScreenTemplate = (props: any) => {
  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} />
      {props.children}
    </View>
  );
};

export default ScreenTemplate;

const styles = StyleSheet.create({});
