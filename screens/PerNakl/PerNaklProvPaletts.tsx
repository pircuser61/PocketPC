//m-prog13 прием передаточной накладной
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacityComponent} from 'react-native';

import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import RecycleList from '../../components/SystemComponents/RecycleList';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';

const ITEM_HEiGHT = 60;

const styles = StyleSheet.create({
  rowLine: {
    flexDirection: 'row',
    height: ITEM_HEiGHT,
    borderBottomWidth: 0.3,
    borderBottomColor: 'grey',
  },
  col1: {flex: 1, justifyContent: 'center'},
  col2: {flex: 6, justifyContent: 'center'},
  colItem: {fontSize: 28},
});

interface IPalettsRow {
  NumDoc: string;
  Flag: string;
}

interface IPaletts {
  ProvPalSpecs: {ProvPalSpecsRow: IPalettsRow[]};
}

export const PerNaklProvPaletts = (props: any) => {
  const numNakl = props.route.params.numNakl;

  const [loading, setloading] = useState(true);
  const [Paletts, setList] = useState<IPalettsRow[]>([]);

  let isMounted = true;
  useEffect(() => {
    getProv();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    CheckPalletsStore.Type = '8';
    CheckPalletsStore.Title = {
      firstScreen: 'паллету',
      secondScreen: 'паллеты',
      thirdScreen: 'Паллета',
      fourScreen: 'паллет',
    };
    return () => {
      CheckPalletsStore.resetStore();
    };
  });

  const getProv = async () => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request(
        'PocketProvSpecsList',
        {numNakl, Type: '8'},
        {
          arrayAccessFormPaths: [
            'PocketProvSpecsList.ProvPalSpecs.ProvPalSpecsRow',
          ],
        },
      )) as IPaletts;
      if (isMounted)
        if (result?.ProvPalSpecs?.ProvPalSpecsRow)
          setList(result.ProvPalSpecs.ProvPalSpecsRow);
        else setList([]);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      if (isMounted) setloading(false);
    }
  };

  const rowRenderer = React.useCallback(
    (tp: any, item: IPalettsRow) => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log(numNakl + ' ' + item.NumDoc);

            props.navigation.navigate('DocumentCheckScreen', {
              item: {
                NumNakl: numNakl,
                NumDoc: item.NumDoc,
              },
            });
          }}>
          <View style={styles.rowLine}>
            <View style={styles.col1}>
              <Text style={styles.colItem}>{item.Flag}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.colItem}>{item.NumDoc}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [Paletts],
  );

  return (
    <ScreenTemplate {...props} title={numNakl + ' Палетты'}>
      <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
        <RecycleList
          data={Paletts}
          itemHeight={ITEM_HEiGHT}
          refreshing={loading}
          onRefresh={getProv}
          _rowRenderer={rowRenderer}
        />
      </View>
    </ScreenTemplate>
  );
};

export default PerNaklProvPaletts;
