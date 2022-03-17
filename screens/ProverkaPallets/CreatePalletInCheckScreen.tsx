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
  Vibration,
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
import {PocketProvSpecsCreate} from '../../functions/PocketProvSpecsCreate';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {GlobalCheckNavProps} from '../../types/types';

type Props = NativeStackScreenProps<
  GlobalCheckNavProps,
  'CreatePalletInCheckScreen'
>;

const CreatePalletInCheckScreen = observer((props: Props) => {
  const [loading, setLoading] = useState(false);
  const [palletNum, setpalletNum] = useState<string>('');
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const [error, seterror] = useState('');
  let mounted = true;

  useEffect(() => {
    if (barcode.data) {
      setpalletNum(barcode.data);
      createPallett({NumDoc: barcode.data});
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  const createPallett = async ({NumDoc}: {NumDoc: string}) => {
    try {
      seterror('');
      setLoading(true);
      await props.route.params.createDocument({NumDoc, isNextScreen: true});
    } catch (error) {
      Vibration.vibrate(500);
      setLoading(false);
      seterror(error + '');
    }
  };

  const customref = useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => customref.current?.focus(), 100);
  });

  return (
    <ScreenTemplate
      {...props}
      title={'Добавление ' + CheckPalletsStore.Title.secondScreen}>
      <View style={{flex: 1}}>
        <InputField
          innerRef={customref}
          title={'Номер документа'}
          placeholder={'Введите или сканируйте...'}
          iconName={'barcode-scan'}
          onIconPress={TOGGLE_SCANNING}
          value={palletNum}
          setValue={(txt: string) => setpalletNum(txt)}
          onChangeText={() => {}}
          isTextInput={true}
          onSubmit={event => createPallett({NumDoc: event.nativeEvent.text})}
        />
        <View style={{paddingHorizontal: 16, alignSelf: 'center'}}>
          <Text style={{color: 'red'}}>
            {error.length > 0 ? 'Ошибка: ' + error : ''}
          </Text>
        </View>
      </View>

      {loading && <LoadingFlexComponent />}
      <PressBotBar
        title={'Добавить'}
        onPress={() => createPallett({NumDoc: palletNum})}
      />
    </ScreenTemplate>
  );
});

export default CreatePalletInCheckScreen;

const styles = StyleSheet.create({});
