import {observer} from 'mobx-react-lite';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Vibration,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {PocketPrPda1s} from '../../../functions/PocketPrPda1s';
import {Divider} from 'react-native-paper';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';

const PriemPoStrihBumage = observer(props => {
  const {navigation, user} = props;
  const [numNakl, setNumNakl] = useState('');
  const _podrRef = useRef(null);

  const _api = PriemMestnyhHook();
  const {barcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      setNumNakl(barcode.data);
      getPalletInfo(barcode.data);
    }
  }, [barcode]);

  useFocusEffect(
    useCallback(() => {
      console.log('Чистка стора');
      NakladNayaStore.resetStore();
    }, []),
  );

  function getPalletInfo(palnum = '') {
    NakladNayaStore.loading = true;
    PocketPrPda1s(
      palnum,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        if (r) {
          NakladNayaStore.nakladnayaInfo = {...r, numNakl: palnum};
          if (r.ListOb[0].Ob[0]) {
            navigation.navigate('ScreenForWorkWithNakladStrih');
          } else {
            navigation.navigate('ChooseOBScreen');
          }
        }
        NakladNayaStore.loading = false;
      })
      .catch(e => {
        alert(e);
        NakladNayaStore.loading = false;
      });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <HeaderPriemka
          navigation={navigation}
          arrow={true}
          title={'Прием по штрих бумаге'}
        />
        <Text style={{fontSize: 20, margin: 16}}>Введите номер накладной:</Text>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            style={{
              height: 56,
              borderColor: 'gray',
              borderWidth: 1,
              marginLeft: 16,
              marginRight: 70,
              backgroundColor: '#D1D1D1',
              paddingLeft: 16,
              borderRadius: 4,
            }}
            keyboardType="numeric"
            onChangeText={text => setNumNakl(text)}
            value={numNakl}
            onSubmitEditing={text => getPalletInfo(numNakl)}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 4, padding: 20}}
            onPress={TOGGLE_SCANNING}>
            <MaterialCommunityIcons name="barcode-scan" size={28} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            height: 48,
            justifyContent: 'center',
            zIndex: 100,
            backgroundColor: '#313C47',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
          onPress={() => getPalletInfo(numNakl)}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
            Далее
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(PriemPoStrihBumage);

/*
        <Text>{JSON.stringify(user)}</Text>
*/
