import {observer} from 'mobx-react-lite';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  alertActions,
  MAIN_COLOR,
  TOGGLE_SCANNING,
} from '../../../constants/funcrions';
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
import InputField from '../../../components/Perepalechivanie/InputField';

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
    Keyboard.dismiss();
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

        <InputField
          title={'Номер накладной'}
          iconName={'barcode-scan'}
          onIconPress={TOGGLE_SCANNING}
          value={numNakl}
          setValue={text => setNumNakl(text)}
          isTextInput={true}
          onSubmit={text => getPalletInfo(numNakl)}
        />
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
