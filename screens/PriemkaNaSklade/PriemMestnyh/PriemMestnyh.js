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
import {
  alertActions,
  MAIN_COLOR,
  TOGGLE_SCANNING,
} from '../../../constants/funcrions';
import {connect} from 'react-redux';
import InputField from '../../../components/Perepalechivanie/InputField';
import LoadingModalComponent from '../../../components/SystemComponents/LoadingModalComponent';

const PriemMestnyh = ({navigation, user}) => {
  const [numNakl, setNumNakl] = useState('');
  const [podrazdToGo, setPodrazdToGo] = useState('');
  const [loading, setLoading] = useState(false);
  const _api = PriemMestnyhHook();
  const {barcode} = _api;
  const _podrRef = useRef(null);

  const _EnterAndFocus = bcd => {
    setNumNakl(bcd.replace(/\D+/g, ''));
    _podrRef.current.focus();
  };

  useEffect(() => {
    //console.log(JSON.stringify(barcode));
    barcode.data ? _EnterAndFocus(barcode.data) : null;
  }, [barcode]);

  const enterNumNaklAndPodrazdToGo = async () => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      if (numNakl.length === 0) {
        alertActions('Введите номер накладной');
        return;
      } else if (podrazdToGo.length === 0) {
        alertActions('Введите номер подразделения');
        return;
      }

      if (numNakl.length > 0 && podrazdToGo.length > 0) {
        const r = await PocketPrPda1(
          numNakl,
          podrazdToGo,
          user.user.TokenData[0].$.UserUID,
          user.user.$['city.cod'],
        );
        const {ParentId = '', IdNum = ''} = r;
        r ? null : Alert.alert('Предупреждение', 'Накладная уже есть!');
        navigation.navigate('WorkWithPallete', {
          numNakl,
          podrazdToGo,
          ParentId,
          IdNum,
        });
      }
    } catch (error) {
      alertActions(error);
    } finally {
      setLoading(false);
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
        <InputField
          onSubmit={() => {
            _podrRef.current.focus();
          }}
          placeholder={'Введите номер накладной'}
          isTextInput={true}
          iconName={'barcode-scan'}
          onIconPress={TOGGLE_SCANNING}
          value={numNakl}
          title={'Номер накладной'}
          setValue={txt => {
            setNumNakl(txt);
          }}
        />
        <InputField
          innerRef={_podrRef}
          placeholder={'Введите номер подразделения'}
          value={podrazdToGo}
          keyboardType="numeric"
          onSubmit={enterNumNaklAndPodrazdToGo}
          isTextInput={true}
          iconName={'close'}
          onIconPress={() => {
            Keyboard.dismiss();
            setNumNakl('');
            setPodrazdToGo('');
          }}
          title={'Номер подразделения'}
          setValue={txt => {
            setPodrazdToGo(txt);
          }}
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
          onPress={enterNumNaklAndPodrazdToGo}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
            Далее
          </Text>
        </TouchableOpacity>
        <LoadingModalComponent modalVisible={loading} />
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

/**
 *  <Text style={{fontSize: 20, margin: 16}}>Введите номер накладной:</Text>
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
          Введите номер подразделения:
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
 */
