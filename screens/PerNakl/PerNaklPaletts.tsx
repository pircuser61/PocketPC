import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {useState} from 'react';
import {alertError} from '../../constants/funcrions';
import RecycleList from '../../components/SystemComponents/RecycleList';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import {Divider} from 'react-native-paper';
import request from '../../soap-client/pocketRequest';

interface Palett {
  NumPal: string;
  Place: {Type: string; PlaceStr: string};
}

interface IPerInfo {
  NumNakl: string;
  Flag: string;
  DtNakl: string;
  ShopFrom: string;
  ShopTo: string;
  Amount: string;
  ShippedBy: string;
  ReceivedBy: string;
  PermitShopTo: string;
  Paletts?: {Palett?: Palett[]};
}

const ITEM_HEiGHT = 40;
let numNakl: string;

const emptyInfo: IPerInfo = {
  NumNakl: '',
  Flag: '',
  DtNakl: '',
  ShopFrom: '',
  ShopTo: '',
  Amount: '',
  ShippedBy: '',
  ReceivedBy: '',
  PermitShopTo: '',
};

export const PerNaklPaletts = (props: any) => {
  const [loading, setloading] = useState(false);
  const [perInfo, setPerInfo] = useState(emptyInfo);

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    getInfo();
  }, []);

  const toGoods = () => {
    props.navigation.navigate('PerNaklSpecs', {numNakl, diff: false});
  };

  const getInfo = async () => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request(
        'PocketPer',
        {numNakl, GetInf: 'true'},
        {arrayAccessFormPaths: ['PocketPer.Paletts.Palett']},
      )) as IPerInfo;
      if (isMounted) setPerInfo(result as IPerInfo);
    } catch (error) {
      alertError(error);
      if (isMounted) setPerInfo(emptyInfo);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  numNakl = props.route.params.numNakl;

  const rowRenderer = React.useCallback(
    (type: any, item: Palett) => {
      return (
        <View style={styles.rowLine}>
          <View style={styles.col1}>
            <Text style={styles.colItem}>{item.NumPal}</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.colItem}>{item.Place.PlaceStr}</Text>
          </View>
          <Divider />
        </View>
      );
    },
    [perInfo],
  );

  return (
    <ScreenTemplate {...props} title={numNakl + ' Параметры'}>
      <View style={{flex: 2}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.labelText}>Накладная:</Text>
          <Text style={styles.simpleText}>{perInfo.Flag}</Text>
          <Text style={styles.simpleText}>{perInfo.NumNakl}</Text>
          <Text style={styles.labelText}>от</Text>
          <Text style={styles.simpleText}>{perInfo.DtNakl}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.labelText}>Из</Text>
          <Text style={styles.simpleText}>{perInfo.ShopFrom}</Text>
          <Text style={styles.labelText}>в</Text>
          <Text style={styles.simpleText}>{perInfo.ShopTo}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.labelText}>Сумма:</Text>
          <Text style={styles.simpleText}>{perInfo.Amount}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.labelText}>Отгрузил:</Text>
          <Text style={styles.simpleText}>{perInfo.ShippedBy}</Text>
          <Text style={styles.labelText}>Принял:</Text>
          <Text style={styles.simpleText}>{perInfo.ReceivedBy}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 6,

          borderBottomWidth: 1,
          paddingLeft: 10,
        }}>
        {perInfo.Paletts?.Palett ? (
          <>
            <View style={[styles.rowLine, {backgroundColor: '#D1D1D1'}]}>
              <View style={styles.col1}>
                <Text style={styles.colItem}>Палетт</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.colItem}>Место</Text>
              </View>
            </View>
            <RecycleList
              data={perInfo.Paletts.Palett}
              itemHeight={ITEM_HEiGHT}
              refreshing={loading}
              onRefresh={getInfo}
              _rowRenderer={rowRenderer}
            />
          </>
        ) : (
          <Text>Нет данных</Text>
        )}
      </View>

      <View
        style={{
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <SimpleButton text="Просмотр товаров" onPress={toGoods} />
        <SimpleButton onPress={getInfo} text="Обновить" />
      </View>
    </ScreenTemplate>
  );
};

export default PerNaklPaletts;

const styles = StyleSheet.create({
  rowLine: {flexDirection: 'row'},

  col1: {flex: 1},
  col2: {flex: 2},
  colItem: {fontSize: 20},
  simpleText: {fontSize: 20, paddingLeft: 10},
  labelText: {fontSize: 20, paddingLeft: 10, fontWeight: 'bold'},
});
