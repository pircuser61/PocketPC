import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import InputField from '../../components/Perepalechivanie/InputField';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import LoadingTextModal from '../../components/SystemComponents/LoadingTextModal';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {alertActions, TOGGLE_SCANNING} from '../../constants/funcrions';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {PocketProvGoodsCreate} from '../../functions/PocketProvGoodsCreate';
import {PocketProvSpecsCreate} from '../../functions/PocketProvSpecsCreate';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {
  GoodsRow,
  ProverkaNakladnyhNavProps,
  ProvPalSpecsRow,
} from '../../types/types';

type Props = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'AddNakladnyaScreen'
>;
const AddNakladnyaScreen = observer((props: Props) => {
  const [barcodNum, setbarcodNum] = useState('');
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      setbarcodNum(barcode.data);
      addNaklad(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const customref = useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => customref.current?.focus(), 100);
  }, []);

  const addNaklad = async (newstr: string) => {
    try {
      if (newstr.length === 0) {
        throw 'Введите номер накладной';
      }
      //seterror('');
      //setLoading(true);
      const res = await props.route.params.createOrNavNakl(newstr, true);
      console.log(res);
    } catch (error) {
      alertActions(error);
    }
  };

  return (
    <ScreenTemplate {...props} title={'Добавление накладной'}>
      <View style={{flex: 1}}>
        <InputField
          innerRef={customref}
          title={'Номер накладной'}
          placeholder={'Введите или сканируйте...'}
          iconName={'barcode-scan'}
          onIconPress={TOGGLE_SCANNING}
          value={barcodNum}
          setValue={(txt: string) => setbarcodNum(txt)}
          onChangeText={() => {}}
          isTextInput={true}
          onSubmit={e => addNaklad(e.nativeEvent.text)}
        />
      </View>

      <PressBotBar title={'Добавить'} onPress={() => addNaklad(barcodNum)} />
    </ScreenTemplate>
  );
});

export default AddNakladnyaScreen;

const styles = StyleSheet.create({});
