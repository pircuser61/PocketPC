import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import SimpleButton from '../../components/SystemComponents/SimpleButton';

const PerNaklMenu = (props: any) => {
  const numNakl = props.route.params.NumNakl;
  const permitTxt =
    props.route.params.PermitShopTo === 'true'
      ? ''
      : 'Нет доступа к подразделению!';

  const goods = () => {
    props.navigation.navigate('PerNaklSpecs', {numNakl});
  };
  const paletts = () => {
    props.navigation.navigate('PerNaklPaletts', {numNakl});
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
        <SimpleButton active={false} text="Пересчет товара" />
        <SimpleButton active={false} text="Просмотр расхождений" />
        <SimpleButton active={false} text="Обнулить пересчет" />
        <SimpleButton active={false} text="Закрыть накладнуюа" />
        <SimpleButton active={false} text="Печать накладной" />
      </View>
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
