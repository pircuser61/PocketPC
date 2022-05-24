import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  StyleSheetProperties,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Divider} from 'react-native-paper';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';

import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import UserStore from '../../mobx/UserStore';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

const LI_HEIGHT = 66;
const LI_WITDH = 1200;
const ROW_HEGHT = 60;

const styles = StyleSheet.create({
  header: {flexDirection: 'row', backgroundColor: '#D1D1D1'},
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDFF',
    width: LI_WITDH,
  },
  rowLineNew: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
    width: LI_WITDH,
  },
  col1: {flex: 1},
  col2: {flex: 4},
  colItem: {fontSize: 18},
});

interface IPal {
  TypeDoc: string;
  NumPal: string;
  Flag: string;
  NumPer: string;
  ShopFrom: string;
  NumZak: string;
  DtZak: string;
  FlagZak: string;
  FromShop: string;
  ToShop: string;
  CodDep: string;
  NumLogPal: string;
  PlaceCount: string;
  Weight: string;
  Amount: string;
  New?: boolean;
}

interface IPalList {
  Palett: IPal[];
  NewIndx?: number;
}

let dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2;
});

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);
layoutProvider.shouldRefreshWithAnchoring = false;

const Cell = ({style, text}: {style: StyleProp<ViewStyle>; text?: string}) => (
  <View style={style}>
    <Text style={styles.colItem}>{text}</Text>
  </View>
);

const TableHeader = () => (
  <View style={styles.header}>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Ф</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Палетт</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Дата</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Ф</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>N Зак</Text>
    </View>

    <View style={styles.col2}>
      <Text style={styles.colItem}>Отдел</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Откуда</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Куда</Text>
    </View>

    <View style={styles.col2}>
      <Text style={styles.colItem}>Мест</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Вес по ТОРГ13</Text>
    </View>

    <View style={styles.col2}>
      <Text style={styles.colItem}>Пер.Накл.</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Тип</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}>Из подр</Text>
    </View>
    <View style={styles.col2}>
      <Text style={styles.colItem}> Логист. палетт</Text>
    </View>
  </View>
);

const rowRenderer = (tp: any, item: IPal) => {
  console.log('RENDER ' + item.NumPal);
  return (
    <View style={item.New ? styles.rowLineNew : styles.rowLine}>
      <View style={styles.col1}>
        <Text style={styles.colItem}>{item.Flag}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.NumPal}</Text>
      </View>

      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.DtZak}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.FlagZak}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.NumZak}</Text>
      </View>

      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.CodDep}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.FromShop}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.ToShop}</Text>
      </View>

      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.PlaceCount}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.Weight}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.Amount}</Text>
      </View>

      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.NumPer}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.TypeDoc}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.ShopFrom}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.colItem}>{item.NumLogPal}</Text>
      </View>

      <Divider />
    </View>
  );
};

export const TtnPalettsOld = (props: any) => {
  const ID = props.route.params.ID;

  const [state, setState] = useState('');
  // const [ttnList, setList] = useState<IPal[]>([]);
  let ttnList: IPal[] = [];
  const listRef = useRef<any>();

  console.log('PALETTS RENDER ' + state);

  let isMounted = true;
  useEffect(() => {
    getTTNpaletts();
    return () => {
      isMounted = false;
    };
  }, []);

  const getTTNpaletts = async () => {
    try {
      console.log('ID ' + ID);
      if (!isMounted) return;
      setState('reqList');
      const result = (await request(
        'PocketTTNpaletts',
        {ID},
        {arrayAccessFormPaths: ['PocketTTN.TTN']},
      )) as IPalList;

      dataProvider = dataProvider.cloneWithRows(
        (result?.Palett ?? []).map((r, i) => ({...r, id: i + 1})),
      );

      //setList(result?.Palett ?? []);
    } catch (error) {
      console.log(error);
      if (isMounted) alertError(error);
    } finally {
      setState('requestComplete');
    }
  };

  const findPalett = async (codOb: string) => {
    try {
      if (!isMounted) return;

      setState('reqCreate');

      const result = (await request(
        'PocketTTN',
        {CurrShop: UserStore.podrazd.Id, CreateToOb: codOb},
        {arrayAccessFormPaths: ['PocketTTNpaletts.Palett']},
      )) as IPalList;
      console.log(result);
      // setList(result?.Palett ?? []);

      if (result?.NewIndx)
        listRef?.current?.scrollToIndex(result?.NewIndx, true);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      if (isMounted) setState('');
    }
  };

  return (
    <ScreenTemplate {...props} title={'Палетты'}>
      <ScrollView horizontal={true}>
        <View
          style={{
            flex: 7,
            borderBottomWidth: 1,
            paddingLeft: 10,
            paddingRight: 10,
            width: LI_WITDH,
          }}>
          <TableHeader />

          {dataProvider.getSize() > 0 ? (
            <RecyclerListView
              ref={listRef}
              onRecreate={e => console.log('recreate' + e)}
              optimizeForInsertDeleteAnimations={true}
              layoutProvider={layoutProvider}
              dataProvider={dataProvider}
              rowRenderer={rowRenderer}
              scrollViewProps={{
                refreshing: props.refreshing,
                refreshControl: (
                  <RefreshControl
                    refreshing={state == 'reqList'}
                    onRefresh={getTTNpaletts}
                  />
                ),
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

export default TtnPalettsOld;
