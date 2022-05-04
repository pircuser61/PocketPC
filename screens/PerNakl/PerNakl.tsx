//m-prog13 прием передаточной накладной
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import useScanner from '../../customHooks/simpleScanHook';

interface IPerInfo {
  NumNakl?: string;
  PermitShopTo?: string;
}

const PerNakl = (props: any) => {
  const [numNakl, setInputValue] = useState('');
  const [loading, setloading] = useState(false);

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  useScanner(setInputValue);

  const find = async () => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request('PocketPer', {
        numNakl: numNakl,
      })) as IPerInfo;
      if (isMounted) props.navigation.navigate('PerNaklMenu', result);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <ScreenTemplate {...props} title={'Прием передаточной накладной'}>
      <View style={{marginLeft: 10, marginRight: 10}}>
        <ScanInput
          title="Номер накладной:"
          placeholder="Введите номер накладной"
          value={numNakl}
          onSubmit={find}
          setValue={setInputValue}></ScanInput>
        <SimpleButton text="Найти" onPress={find} />
      </View>
      <LoadingModalComponent modalVisible={loading} />
    </ScreenTemplate>
  );
};

export default PerNakl;
