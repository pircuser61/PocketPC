import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InputField from '../../../components/Perepalechivanie/InputField';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {PocketPerepal1} from '../../../functions/PocketPerepal1';
import {connect} from 'react-redux';
import {observer} from 'mobx-react-lite';
import PerepalechivanieStore from '../../../mobx/PerepalechivanieStore';
import {ActivityIndicator} from 'react-native-paper';
import {PocketPerepalPalFrom} from '../../../functions/PocketPerepalPalFrom';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
  textInputField: {
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 16,
    marginRight: 70,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
  palletInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
});

const StartPerepalech = observer(props => {
  const [numZadanya, setNumZadanya] = useState('29620');
  const [numpalFrom, setNumpalFrom] = useState('461464');
  const {navigation, user} = props;

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    return () => {
      PerepalechivanieStore.resetStore();
    };
  }, []);

  const getListOfShops = (barcode = '') => {
    PerepalechivanieStore.loadingPalletFrom = true;
    PocketPerepalPalFrom(
      PerepalechivanieStore.parrentId,
      barcode,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        PerepalechivanieStore.palletsList = r.map(item => {
          return {...item, palletNumber: ''};
        });
        PerepalechivanieStore.loadingPalletFrom = false;
        navigation.navigate('SpecifyPalletsScreens');
      })
      .catch(e => {
        alertActions(e);
        PerepalechivanieStore.loadingPalletFrom = false;
      });
  };

  const getParrentID = (barcode = '') => {
    PerepalechivanieStore.loadingNumZadanya = true;
    PocketPerepal1(
      barcode,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        PerepalechivanieStore.parrentId = r;
        PerepalechivanieStore.loadingNumZadanya = false;
      })
      .catch(e => {
        alertActions(e);
        PerepalechivanieStore.loadingNumZadanya = false;
      });
  };

  const obrabotkaBarcode = barcode => {
    if (!PerepalechivanieStore.parrentId) {
      PerepalechivanieStore.numZadanya = barcode;
      getParrentID(barcode);
      setBarcode({data: '', time: '', type: ''});
    } else {
      PerepalechivanieStore.numpalFrom = barcode;
      getListOfShops(barcode);
      setBarcode({data: '', time: '', type: ''});
    }
  };

  useEffect(() => {
    if (
      barcode.data &&
      PerepalechivanieStore.loadingNumZadanya === false &&
      PerepalechivanieStore.loadingPalletFrom === false
    ) {
      console.log(barcode);
      obrabotkaBarcode(barcode.data);
    }
  }, [
    barcode,
    PerepalechivanieStore.loadingNumZadanya,
    PerepalechivanieStore.loadingPalletFrom,
  ]);

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={styles.countainer}>
      <View style={styles.countainer}>
        <HeaderPriemka {...props} title={'Перепалечивание'} />
        <InputField
          title={'Номер задания'}
          iconName={'information-outline'}
          onIconPress={TOGGLE_SCANNING}
          value={PerepalechivanieStore.numZadanya}
          onSubmit={() => {
            getParrentID(PerepalechivanieStore.numZadanya);
          }}
          setValue={txt => (PerepalechivanieStore.numZadanya = txt)}
          onChangeText={() => {
            PerepalechivanieStore.parrentId = '';
          }}
          loading={PerepalechivanieStore.loadingNumZadanya}
          isTextInput={true}
        />
        <InputField
          notiplaceholder={'Сканируйте номер паллеты'}
          title={'Паллета откуда'}
          iconName={'map-marker-left-outline'}
          onIconPress={TOGGLE_SCANNING}
          value={PerepalechivanieStore.numpalFrom}
          setValue={txt => (PerepalechivanieStore.numpalFrom = txt)}
          onSubmit={() => {
            getListOfShops(PerepalechivanieStore.numpalFrom);
          }}
          loading={PerepalechivanieStore.loadingPalletFrom}
        />
        <ButtonBot
          disabled={
            PerepalechivanieStore.loadingNumZadanya ||
            PerepalechivanieStore.loadingPalletFrom
          }
          title={
            PerepalechivanieStore.parrentId
              ? 'Далее'
              : PerepalechivanieStore.numZadanya
              ? 'Получить данные о задании'
              : 'Сканируйте или введите номер задания'
          }
          onPress={() => {
            if (!PerepalechivanieStore.parrentId) {
              getParrentID(PerepalechivanieStore.numZadanya);
              return;
            }
            if (!PerepalechivanieStore.numZadanya) {
              alertActions('Сканируйте или введите номер задания!');
              return;
            }
            if (!PerepalechivanieStore.numpalFrom) {
              alertActions('Сканируйте номер паллеты откуда!');
              return;
            }
            getListOfShops(PerepalechivanieStore.numpalFrom);
          }}
        />
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

export default connect(mapStateToProps, {})(StartPerepalech);
