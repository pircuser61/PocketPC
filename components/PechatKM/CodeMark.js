import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';

const CodeMark = ({TOGGLE_SCANNING, api}) => {
  const {gtinsList, barcodeInfo, GtinAndSerial} = api;

  return (
    <TouchableOpacity
      disabled={gtinsList.length === 0}
      onPress={TOGGLE_SCANNING}
      style={{
        //backgroundColor: 'white',
        backgroundColor:
          GtinAndSerial.gtin.length > 0
            ? 'green'
            : barcodeInfo.CodGood.length > 0 && gtinsList.length > 0
            ? '#9d9d9d'
            : '#F4D969',
        height: 108,
        width: '100%',
        borderRadius: 8,
        marginTop: 20,
      }}>
      <View
        style={{
          backgroundColor: GtinAndSerial.gtin.length > 0 ? 'white' : MAIN_COLOR,
          height: 100,
          width: '100%',
          justifyContent: 'center',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            padding: 20,
            textAlign: 'center',
            fontWeight: 'bold',
            color: GtinAndSerial.gtin.length > 0 ? 'black' : 'white',
          }}>
          {GtinAndSerial.gtin.length > 0
            ? 'Gtin: ' +
              GtinAndSerial.gtin +
              '\n' +
              'Serial: ' +
              GtinAndSerial.serial
            : gtinsList.length > 0
            ? 'Сканируйте код маркировки'
            : 'Загрузка гтинов'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CodeMark;
