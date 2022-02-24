import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MAIN_COLOR} from '../../constants/funcrions';

interface Props {
  action?: () => void;
  title: string;
}

const BottomSheetButtom = ({action = () => {}, title = ''}: Props) => {
  return (
    <View style={{paddingVertical: 4}}>
      <TouchableOpacity
        onPress={action}
        style={{
          backgroundColor: MAIN_COLOR,
          justifyContent: 'center',
          height: 50,
          borderRadius: 8,
          paddingHorizontal: 8,
        }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomSheetButtom;

const styles = StyleSheet.create({});
