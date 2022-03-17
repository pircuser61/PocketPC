import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import InputField from '../../components/Perepalechivanie/InputField';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {
  alertActions,
  timeout,
  TOGGLE_SCANNING,
} from '../../constants/funcrions';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import MountedHook from '../../hooks/SystemHook/MountedHook';
import {AddGoodsInCheckScreenParamsProps} from '../../types/types';

const AddSomethingScreen = (props: any) => {
  let mounted = true;
  const [loading, setLoading] = useState(false);
  const [barcodNum, setbarcodNum] = useState('');
  const [error, seterror] = useState('');
  const {action, title = '', inputtitle = '', bot} = props.route
    .params as AddGoodsInCheckScreenParamsProps;

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data) {
      setbarcodNum(barcode.data);
      addGoodLocal(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const customref = useRef<TextInput>(null);
  useEffect(() => {
    setTimeout(() => customref.current?.focus(), 100);
  }, []);

  const addGoodLocal = useCallback(
    async (scaned = '') => {
      try {
        seterror('');
        setLoading(true);
        await action(scaned);
        if (mounted) {
          props.navigation.goBack();
        }
      } catch (error) {
        if (mounted) {
          seterror(error + '');
          setLoading(false);
        }
      }
    },
    [mounted, error],
  );

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
      <ScreenTemplate {...props} title={title}>
        <View style={{flex: 1}}>
          <InputField
            innerRef={customref}
            title={inputtitle}
            placeholder={'Введите или сканируйте...'}
            iconName={'barcode-scan'}
            onIconPress={TOGGLE_SCANNING}
            value={barcodNum}
            setValue={(txt: string) => setbarcodNum(txt)}
            onChangeText={() => {}}
            isTextInput={true}
            onSubmit={event => addGoodLocal(event.nativeEvent.text)}
          />
          {loading && <LoadingFlexComponent />}

          <View style={{paddingHorizontal: 16, alignSelf: 'center'}}>
            <Text style={{color: 'red'}}>
              {error.length > 0 ? 'Ошибка: ' + error : ''}
            </Text>
          </View>
        </View>

        <PressBotBar
          disabled={loading}
          title={bot ? bot : 'Добавить'}
          onPress={() => addGoodLocal(barcodNum)}
        />
      </ScreenTemplate>
    </TouchableWithoutFeedback>
  );
};

export default AddSomethingScreen;

const styles = StyleSheet.create({});
