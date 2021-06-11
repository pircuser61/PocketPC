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
} from 'react-native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import DataWedgeIntents from 'react-native-datawedge-intents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {PocketPrPda1} from '../../../functions/PocketPrPda1';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
import {connect} from 'react-redux';

const PriemMestnyh = ({navigation, user}) => {
  const [numNakl, setNumNakl] = useState('');
  const [podrazdToGo, setPodrazdToGo] = useState('');
  const _api = PriemMestnyhHook();
  const {barcode} = _api;
  const _podrRef = useRef(null);

  const _EnterAndFocus = () => {
    setNumNakl(barcode.data.replace(/\D+/g, ''));
    _podrRef.current.focus();
  };

  useEffect(() => {
    barcode.data ? _EnterAndFocus() : null;
  }, [barcode]);

  const enterNumNaklAndPodrazdToGo = () => {
    Vibration.vibrate(200);
    if (numNakl.length > 0 && podrazdToGo.length > 0) {
      PocketPrPda1(
        numNakl,
        podrazdToGo,
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      )
        .then(r => {
          const {ParentId = '', IdNum = ''} = r;
          r ? null : Alert.alert('Предупреждение', 'Накладная уже есть!');
          Vibration.vibrate(200);
          navigation.navigate('WorkWithPallete', {
            numNakl,
            podrazdToGo,
            ParentId,
            IdNum,
          });
        })
        .catch(e => {
          console.log(e);
          alertActions(e);
        });
    } else {
      if (numNakl.length === 0) {
        alertActions('Введите номер накладной');
      } else if (podrazdToGo.length === 0) {
        alertActions('Введите номер подразделения');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <HeaderPriemka
          navigation={navigation}
          arrow={true}
          title={'Прием местных'}
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
            onSubmitEditing={() => {
              _podrRef.current.focus();
            }}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 4, padding: 20}}
            onPress={TOGGLE_SCANNING}>
            <MaterialCommunityIcons name="barcode-scan" size={28} />
          </TouchableOpacity>
        </View>

        <Text style={{fontSize: 20, margin: 16}}>
          Введите номер подразделения :
        </Text>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            style={{
              height: 56,
              borderColor: 'gray',
              borderWidth: 1,
              backgroundColor: '#D1D1D1',
              marginLeft: 16,
              marginRight: 70,
              paddingLeft: 16,
              borderRadius: 4,
            }}
            ref={_podrRef}
            onChangeText={text => setPodrazdToGo(text)}
            value={podrazdToGo}
            keyboardType="numeric"
            onSubmitEditing={enterNumNaklAndPodrazdToGo}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 4, padding: 20}}
            onPress={() => {
              Keyboard.dismiss();
              setNumNakl('');
              setPodrazdToGo('');
            }}>
            <MaterialCommunityIcons name="close" size={28} />
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
          onPress={enterNumNaklAndPodrazdToGo}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
            Далее
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(PriemMestnyh);
