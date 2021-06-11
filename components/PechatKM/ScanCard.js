import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScanCard = ({TOGGLE_SCANNING, scannedData, barcodeInfo}) => {
  return (
    <TouchableOpacity
      onPress={TOGGLE_SCANNING}
      style={[
        styles.touchable,
        {
          backgroundColor:
            scannedData.length > 0 && barcodeInfo.CodGood.length > 0
              ? 'green'
              : scannedData.length > 0 && barcodeInfo.CodGood.length === 0
              ? '#F4D969'
              : 'grey',
        },
      ]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              barcodeInfo.CodGood.length > 0 ? 'white' : '#313C47',
          },
        ]}>
        <View style={{maxWidth: 200}}>
          <Text
            style={[
              styles.text,
              {color: barcodeInfo.CodGood.length > 0 ? 'black' : 'white'},
            ]}
            numberOfLines={1}>
            {scannedData.length > 0 ? scannedData : 'Сканируйте баркод'}{' '}
          </Text>
        </View>

        <MaterialCommunityIcons
          style={{alignSelf: 'center'}}
          name="barcode-scan"
          size={30}
          color={barcodeInfo.CodGood.length > 0 ? 'black' : 'white'}
        />
      </View>
    </TouchableOpacity>
  );
};

//'#4885ed'
const styles = StyleSheet.create({
  touchable: {
    height: 108,
    backgroundColor: 'grey',
    borderRadius: 8,
  },

  card: {
    //paddingTop:10,
    height: 100,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    opacity: 0.94,
  },
});
export default ScanCard;
