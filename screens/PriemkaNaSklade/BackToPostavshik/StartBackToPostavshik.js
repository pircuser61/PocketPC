import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import InputField from '../../../components/Perepalechivanie/InputField';
import NewInputCard from '../../../components/Perepalechivanie/NewInputCard';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {TOGGLE_SCANNING} from '../../../constants/funcrions';
import BackToPostavshikStore from '../../../mobx/BackToPostavshikStore';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
/**
 * <InputField
          title={'Номер документа'}
          placeholder={'Номер документа'}
          iconName={'information-outline'}
          onIconPress={TOGGLE_SCANNING}
        value={BackToPostavshikStore.documentNumber}
          onSubmit={() => {}}
          setValue={txt => (BackToPostavshikStore.documentNumber = txt)}
          onChangeText={() => {
            //PerepalechivanieStore.parrentId = '';
          }}
          //loading={PerepalechivanieStore.loadingNumZadanya}
          isTextInput={true}
        />
 */

const StartBackToPostavshik = observer(props => {
  const {navigation, user} = props;

  const api = PriemMestnyhHook();
  const {barcode} = api;

  useEffect(() => {
    if (barcode.data) {
      BackToPostavshikStore.documentNumber = barcode.data;
      getDocInfoInComp();
    }
  }, [barcode]);

  const getDocInfoInComp = () => {
    if (BackToPostavshikStore.documentNumber) {
      BackToPostavshikStore.getSpecsList(
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
        () => navigation.navigate('ItemListBackToPost'),
      );
    } else {
      alert('Не указан номер документа!');
    }
  };

  useEffect(() => {
    return () => {
      BackToPostavshikStore.resetStore();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <HeaderPriemka {...props} title={'Возвраты поставщику'} />
        <InputField
          title={'Номер документа'}
          placeholder={'Номер документа'}
          iconName={'information-outline'}
          onIconPress={TOGGLE_SCANNING}
          value={BackToPostavshikStore.documentNumber}
          onSubmit={() => {}}
          setValue={txt => (BackToPostavshikStore.documentNumber = txt)}
          onChangeText={() => {
            //PerepalechivanieStore.parrentId = '';
          }}
          loading={BackToPostavshikStore.loadingListOfSpecs}
          isTextInput={true}
        />

        <ButtonBot
          title={'Далее'}
          disabled={BackToPostavshikStore.loadingListOfSpecs}
          onPress={getDocInfoInComp}
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

export default connect(mapStateToProps)(StartBackToPostavshik);
