import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const BottomSheetButton = observer(props => {
  const {title = '', onPress = () => {}, loading = false} = props;
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      style={{
        width: '90%',
        height: 54,
        backgroundColor: MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
      }}>
      <Text style={{color: 'white', textAlign: 'center'}}>{title}</Text>
      {loading ? (
        <ActivityIndicator
          color={'white'}
          style={{position: 'absolute', alignSelf: 'flex-end', right: 8}}
        />
      ) : null}
    </TouchableOpacity>
  );
});

export default BottomSheetButton;

const styles = StyleSheet.create({});
