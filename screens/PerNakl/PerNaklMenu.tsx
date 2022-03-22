import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import {IS_DEV} from '../../constants/funcrions';
const PerNaklMenu = (props: any) => {
  const [loading, setloading] = useState(false);

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  const numNakl = props.route.params.NumNakl;
  const permitTxt =
    props.route.params.PermitShopTo === 'true'
      ? ''
      : 'Нет доступа к подразделению!';

  const paletts = () => {
    props.navigation.navigate('PerNaklPaletts', {numNakl});
  };

  const provPaletts = () => {
    props.navigation.navigate('PerNaklProvPaletts', {numNakl});
  };
  const viewDiff = () => {
    props.navigation.navigate('PerNaklSpecs', {numNakl, diff: true});
  };

  const provDeleteDlg = () => {
    Alert.alert(
      'Внимание!',
      'Удалить пересчет ' + numNakl + '?',
      [{text: 'Ок', onPress: provDelete}, {text: 'Отмена'}],
      {cancelable: false},
    );
  };

  const provDelete = async () => {
    try {
      setloading(true);
      await request('PocketProvDelete', {numNakl, Type: '8'});
    } catch (error) {
      alertError(error);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  const perCloseDlg = () => {
    Alert.alert(
      'Внимание!',
      'Закрыть накладную ' + numNakl + '?',
      [{text: 'Ок', onPress: perClose}, {text: 'Отмена'}],
      {cancelable: false},
    );
  };

  const perClose = async () => {
    try {
      setloading(true);
      await request('PocketPerClose', {numNakl});
    } catch (error) {
      alertError(error);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  return (
    <ScreenTemplate {...props} title={'Прием передаточной накладной'}>
      <View style={{paddingLeft: 10, paddingRight: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.labelText}>Накладная</Text>
          <Text style={styles.simpleText}>{numNakl}</Text>
        </View>
        <Text style={styles.simpleText}>{permitTxt}</Text>
        <SimpleButton text="Просмотр накладной" onPress={paletts} />
        <SimpleButton text="Пересчет товара" onPress={provPaletts} />
        <SimpleButton text="Просмотр расхождений" onPress={viewDiff} />
        <SimpleButton text="Обнулить пересчет" onPress={provDeleteDlg} />
        {IS_DEV ? (
          <SimpleButton text="Закрыть накладную" onPress={perCloseDlg} />
        ) : (
          <SimpleButton text="Закрыть накладную" active={false} />
        )}
        <SimpleButton active={false} text="Печать накладной" />
      </View>
      <LoadingModalComponent modalVisible={loading} />
    </ScreenTemplate>
  );
};

export default PerNaklMenu;

const styles = StyleSheet.create({
  simpleText: {fontSize: 20, paddingLeft: 20, paddingTop: 10},
  labelText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 10,
    fontWeight: 'bold',
  },

  SimpleButtonContainer: {
    justifyContent: 'center',
    //alignItems: 'center',
  },

  simpleButtonText: {
    height: 48,
    color: '#D1D1D1',
    borderColor: 'gray',
    borderWidth: 1,

    marginTop: 10,
    backgroundColor: '#F1F1F1',
    paddingLeft: 16,
    borderRadius: 4,
    fontSize: 22,
  },
});
