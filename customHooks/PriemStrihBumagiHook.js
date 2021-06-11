import React, {useEffect, useState} from 'react';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {DeviceEventEmitter} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';

const PriemStrihBumagiHook = () => {
  const [barcode, setBarcode] = useState({data: '', time: '', type: ''});

  const registerBroadcastReceiver = () => {
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: [
        'com.zebra.PocketPC.ACTION',
        'com.symbol.datawedge.api.RESULT_ACTION',
      ],
      filterCategories: ['android.intent.category.DEFAULT'],
    });
  };

  const broadcastReceiver = intent => {
    try {
      //console.log('Получено намерение: ' + JSON.stringify(intent));
      if (!intent.hasOwnProperty('RESULT_INFO')) {
        // Результат сканирования баркода
        barcodeScanned(intent);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //

  const barcodeScanned = scanData => {
    let scannedData = scanData['com.symbol.datawedge.data_string'];
    let scannedType = scanData['com.symbol.datawedge.label_type'];
    let current = new Date();
    console.log('/' + scannedData.replace(' ', '') + '/');
    setBarcode({
      data: scannedData,
      time: current.toLocaleTimeString(),
      type: scannedType,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      let deviceEmitterSubscription = DeviceEventEmitter.addListener(
        'datawedge_broadcast_intent',
        intent => {
          broadcastReceiver(intent);
        },
      );
      registerBroadcastReceiver();
      return () => {
        deviceEmitterSubscription.remove();
      };
    }, []),
  );

  return {barcode};
};

export default PriemStrihBumagiHook;
