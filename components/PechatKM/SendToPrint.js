import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PocketPrintMarkHonest} from '../../functions/PocketPrintMarkHonest';

const SendToPrint = ({api, printer, user, showError}) => {
  const {GtinAndSerial, barcodeInfo, setMiddleScan} = api;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        backgroundColor: 'green',
        height: 108,
        width: '100%',
        borderRadius: 8,
        marginTop: 20,
      }}
      disabled={GtinAndSerial.gtin.length === 0}
      onPress={() => {
        PocketPrintMarkHonest(
          printer, // Имя принтера
          GtinAndSerial.gtin, //gtin
          GtinAndSerial.serial, // Серия
          GtinAndSerial.qr,
          barcodeInfo['CodGood'], //Код товара
          user['user']['$']['city.cod'], // код города
          user['user']['TokenData'][0]['$']['UserUID'], // Номер пользователя
          GtinAndSerial.gtinInfo.country[0]['_'], //Страна
          GtinAndSerial.gtinInfo.name[0]['_'], //Имя товара
          GtinAndSerial.gtinInfo.productsize[0]['_'], // Размер товара
          GtinAndSerial.gtinInfo.brand[0]['_'], //Brand
          GtinAndSerial.gtinInfo.model[0]['_'], //Model
        )
          .then(r => {
            console.log(r);
            showError('green', barcodeInfo['CodGood'] + ' ' + r, 'white');
            setMiddleScan({scan: '', time: ''});
          })

          .catch(e => {
            showError('red', e, 'white');
            //reload(false)
          });
      }}>
      <View
        style={{
          backgroundColor: 'green',
          height: 100,
          width: '100%',
          justifyContent: 'center',
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
          Отправить на печать{' '}
        </Text>
        <MaterialIcons name="print" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default SendToPrint;
