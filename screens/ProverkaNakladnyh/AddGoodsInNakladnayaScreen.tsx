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
  Pressable,
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
import {PocketProvperGoodsCreate} from '../../functions/PocketProvperGoodsCreate';
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
  'AddGoodsInNakladnayaScreen'
>;
const AddGoodsInNakladnayaScreen = observer((props: Props) => {
  const [loading, setLoading] = useState(false);
  const [barcodNum, setbarcodNum] = useState('');
  const [error, seterror] = useState('');
  const {addGood} = props.route.params;

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      setbarcodNum(barcode.data);
      addGoodLocal(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const addGoodLocal = async (scaned = '') => {
    try {
      seterror('');
      setLoading(true);
      await addGood(scaned, true);
    } catch (error) {
      seterror(error + '');
      setLoading(false);
    }
  };

  const customref = useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => customref.current?.focus(), 100);
  });

  return (
    <Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>
      <ScreenTemplate {...props} title={'Добавление товара'}>
        <View style={{flex: 1}}>
          <InputField
            innerRef={customref}
            title={'Баркод'}
            placeholder={'Введите или сканируйте...'}
            iconName={'barcode-scan'}
            onIconPress={TOGGLE_SCANNING}
            value={barcodNum}
            setValue={(txt: string) => setbarcodNum(txt)}
            onChangeText={() => {}}
            isTextInput={true}
            onSubmit={event => addGoodLocal(event.nativeEvent.text)}
          />

          <View style={{paddingHorizontal: 16, alignSelf: 'center'}}>
            <Text style={{color: 'red'}}>
              {error.length > 0 ? 'Ошибка: ' + error : ''}
            </Text>
          </View>
          {loading && <LoadingFlexComponent />}
        </View>

        <PressBotBar
          disabled={loading}
          title={'Добавить'}
          onPress={() => addGoodLocal(barcodNum)}
        />
      </ScreenTemplate>
    </Pressable>
  );
});

export default AddGoodsInNakladnayaScreen;

const styles = StyleSheet.create({});

/**
 *   <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <InputField
            title={'Баркод'}
            placeholder={'Введите или сканируйте...'}
            iconName={'barcode-scan'}
            onIconPress={TOGGLE_SCANNING}
            value={barcodNum}
            setValue={(txt: string) => setbarcodNum(txt)}
            onChangeText={() => {}}
            isTextInput={true}
          />
          <View style={{paddingHorizontal: 16, alignSelf: 'center'}}>
            <Text style={{color: 'red'}}>
              {error.length > 0 ? 'Ошибка: ' + error : ''}
            </Text>
          </View>
        </View>

        <PressBotBar title={'Добавить товар'} onPress={addGood} />
        <LoadingTextModal modalVisible={loading} />
      </View>
    </TouchableWithoutFeedback>
 */
