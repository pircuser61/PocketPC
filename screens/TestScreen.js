import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderPriemka from '../components/PriemkaNaSklade/Header';
import BackToPostFilterHook from '../customHooks/BackToPostFilterHook';
import ScanApi from '../customHooks/scannerApi';

const TestScreen = observer(props => {
  const {user} = props;
  const api = BackToPostFilterHook({user});

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'Тестовый экран'} />

      <Button
        title={'all'}
        onPress={() => {
          let current = new Date();
          api.setSignal({time: current.toLocaleTimeString()});
        }}
      />
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(TestScreen);

const styles = StyleSheet.create({});
