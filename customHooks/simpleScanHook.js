import React from 'react';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {DeviceEventEmitter} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';

const useScanner = callback => {
  const barcodeScanned = scanData => {
    let scannedData = scanData['com.symbol.datawedge.data_string'];
    //let scannedType = scanData['com.symbol.datawedge.label_type'];
    callback(scannedData);
  };

  useFocusEffect(
    React.useCallback(() => {
      const listener = DeviceEventEmitter.addListener(
        'datawedge_broadcast_intent',
        barcodeScanned,
      );

      DataWedgeIntents.registerBroadcastReceiver({
        filterActions: [
          'com.zebra.PocketPC.ACTION',
          'com.symbol.datawedge.api.RESULT_ACTION',
        ],
        filterCategories: ['android.intent.category.DEFAULT'],
      });

      return () => {
        listener.remove();
      };
    }, []),
  );
};

export default useScanner;
