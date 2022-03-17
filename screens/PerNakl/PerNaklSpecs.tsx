//m-prog13 прием передаточной накладной
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import RecycleList from '../../components/SystemComponents/RecycleList';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import useScanner from '../../customHooks/simpleScanHook';

const ITEM_HEiGHT = 76;
const ROW2_HEiGHT = 36;

const styles = StyleSheet.create({
  rowLine: {flexDirection: 'row'},
  col1: {flex: 4},
  col2: {flex: 1.8},
  col3: {flex: 2},
  colItem: {fontSize: 18},
});

interface ISpecsRow {
  NN: string;
  CodGood: string;
  CodLevel: string;
  KatArt: string;
  KatName: string;
  QtyFact: string;
  QtyPer: string;
  QtyShop: string;
}

interface ISpecs {
  Specs: {SpecsRow: ISpecsRow[]};
}

interface IRow {
  NN: string;
}

export const PerNaklSpecs = (props: any) => {
  const numNakl = props.route.params.numNakl;

  const [loading, setloading] = useState(true);
  const [specs, setList] = useState<ISpecsRow[]>([]);
  const [inputVal, setInputVal] = useState('');
  const listRef = useRef<any>();

  let isMounted = true;
  useEffect(() => {
    getSpecs();
    return () => {
      isMounted = false;
    };
  }, []);

  useScanner((val: string) => {
    setInputVal(val);
    findGoods(val);
  });

  const getSpecs = async () => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request(
        'PocketPerSpecs',
        {numNakl},
        {arrayAccessFormPaths: ['PocketPerSpecs.Specs.SpecsRow']},
      )) as ISpecs;
      if (isMounted)
        if (result?.Specs?.SpecsRow) setList(result.Specs.SpecsRow);
        else setList([]);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  const findGoods = async (barCod: string) => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request('PocketPerSpecsRow', {
        NumNakl: numNakl,
        BarCod: barCod,
      })) as IRow;
      if (!isMounted) return;

      if (result.NN === '-1') throw 'Товар не найден в накладной.';
      const indx = specs.findIndex(obj => obj.NN === result.NN);
      listRef?.current?.scrollToIndex(indx, true);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  const rowRenderer = React.useCallback(
    (tp: any, item: ISpecsRow) => {
      return (
        <View style={{flex: 1}} key={item.NN}>
          <View style={styles.rowLine}>
            <View style={styles.col1}>
              <Text style={styles.colItem}>{item.CodGood}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.colItem}>{item.CodLevel}</Text>
            </View>

            <View style={styles.col3}>
              <Text style={styles.colItem}>{item.QtyPer}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.colItem}>{item.QtyFact}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.colItem}>{item.QtyShop}</Text>
            </View>
          </View>
          <View style={styles.rowLine}>
            <Text numberOfLines={2} style={{height: ROW2_HEiGHT}}>
              {item.KatArt + '  ' + item.KatName}
            </Text>
          </View>
          <Divider />
        </View>
      );
    },
    [specs],
  );

  return (
    <ScreenTemplate {...props} title={numNakl + ' Список товаров'}>
      <View style={{flex: 1}}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
          }}>
          <ScanInput
            placeholder="Поиск по баркоду"
            value={inputVal}
            onSubmit={() => findGoods(inputVal)}
            setValue={setInputVal}></ScanInput>
        </View>
        <View
          style={{
            flex: 7,
            borderBottomWidth: 1,
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <View style={[styles.rowLine, {backgroundColor: '#D1D1D1'}]}>
            <View style={styles.col1}>
              <Text>Код товара</Text>
            </View>
            <View style={styles.col2}>
              <Text>Код цены</Text>
            </View>

            <View style={styles.col3}>
              <Text>Кол-во накл.</Text>
            </View>
            <View style={styles.col3}>
              <Text>Кол-во факт.</Text>
            </View>
            <View style={styles.col3}>
              <Text>Кол-во в подр.</Text>
            </View>
          </View>
          <RecycleList
            data={specs}
            customref={listRef}
            itemHeight={ITEM_HEiGHT}
            refreshing={loading}
            onRefresh={getSpecs}
            _rowRenderer={rowRenderer}
          />
        </View>
        <View
          style={{
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}>
          <SimpleButton onPress={getSpecs} text="Обновить" />
        </View>
      </View>
    </ScreenTemplate>
  );
};

export default PerNaklSpecs;
