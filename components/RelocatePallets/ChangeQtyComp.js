import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import RelocaPalletsteStore from '../../mobx/RelocaPalletsteStore';

const ChangeQtyComp = observer(({data = '', title = '', keystroke = ''}) => {
  return (
    <View
      style={{
        height: 100,
        width: '46%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
      }}>
      <Text style={{fontSize: 10, fontWeight: 'bold'}}>{title}:</Text>
      <View style={{backgroundColor: 'white', borderRadius: 4, borderWidth: 1}}>
        <TextInput
          style={{alignSelf: 'center', width: 100, textAlign: 'center'}}
          keyboardType={'number-pad'}
          value={RelocaPalletsteStore.changeLocation[keystroke]}
          onChangeText={txt =>
            (RelocaPalletsteStore.changeLocation[keystroke] = txt)
          }
        />
      </View>
    </View>
  );
});

export default ChangeQtyComp;

const styles = StyleSheet.create({});
