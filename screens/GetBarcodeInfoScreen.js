import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import HeaderPriemka from '../components/PriemkaNaSklade/Header';
import {MAIN_COLOR, TOGGLE_SCANNING} from '../constants/funcrions';
import BackToPostFilterHook from '../customHooks/BackToPostFilterHook';
import PriemMestnyhHook from '../customHooks/PriemMestnyhHook';
import ScanApi from '../customHooks/scannerApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const GetBarcodeInfoScreen = observer(props => {
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const [currentBarcode, setCurrentBarCode] = useState({
    curbar: '',
    curtype: '',
    curtime: '',
  });

  useEffect(() => {
    if (barcode.data) {
      console.log(barcode.data);
      setCurrentBarCode({
        curbar: barcode.data,
        curtype: barcode.type,
        curtime: barcode.time,
      });
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);
  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'Тест сканера'} needHome={false} />
      <View
        style={{
          flex: 1,
        }}>
        {currentBarcode.curbar ? (
          <View style={{padding: 16}}>
            <Text style={{fontSize: 12}}>Расшифровка баркода:</Text>
            <Text>{currentBarcode.curbar.toString()}</Text>
            <View style={{height: 16}} />
            <Divider />
            <View style={{height: 16}} />
            <Text style={{fontSize: 12}}>Тип баркода:</Text>
            <Text>{currentBarcode.curtype.toString()}</Text>
            <View style={{height: 16}} />
            <Divider />
            <View style={{height: 16}} />
            <Text style={{fontSize: 12}}>Время сканирования:</Text>
            <Text>{currentBarcode.curtime}</Text>
            <View style={{height: 16}} />
            <Divider />
          </View>
        ) : (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={76}
              color="black"
              style={{opacity: 0.6}}
            />

            <Text
              style={{
                fontSize: 16,
                marginVertical: 8,
                textAlign: 'center',
                opacity: 0.6,
                paddingBottom: 60,
                fontWeight: '400',
              }}>
              Cканируйте что-нибудь...
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{
          height: 48,
          justifyContent: 'center',
          zIndex: 100,
          backgroundColor: MAIN_COLOR,
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        onPress={TOGGLE_SCANNING}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Вкл/выкл сканер
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(GetBarcodeInfoScreen);

const styles = StyleSheet.create({});
