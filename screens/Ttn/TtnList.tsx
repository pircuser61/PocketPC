import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Divider} from 'react-native-paper';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import RecycleList from '../../components/SystemComponents/RecycleList';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import TtnCreateDlg from './TtnCreateDlg';
import UserStore from '../../mobx/UserStore';

const ITEM_HEiGHT = 66;
const ROW_HEGHT = 60;

const styles = StyleSheet.create({
  header: {flexDirection: 'row', backgroundColor: '#D1D1D1'},
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDFF',
    height: ROW_HEGHT,
  },
  rowLineSel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },
  col1: {flex: 1},
  col2: {flex: 4},
  col3: {flex: 3},
  col4: {flex: 3},
  col5: {flex: 3},
  colItem: {fontSize: 18},
});

interface ITTN {
  ID: string;
  Flag: string;
  DtNakl: string;
  NumDoc: string;
  ObFrom: string;
  ObTo: string;
  Selected?: boolean;
}

interface ITTNlist {
  TTN: ITTN[];
  SelIndx?: number;
}

export const TtnList = (props: any) => {
  const [state, setState] = useState('');
  const [ttnList, setList] = useState<ITTN[]>([]);
  const listRef = useRef<any>();

  console.log('TTN LIST RENDER state: ' + state);

  let isMounted = true;
  useEffect(() => {
    getTTNlist();
    return () => {
      isMounted = false;
    };
  }, []);

  const getTTNlist = async () => {
    try {
      if (!isMounted) return;
      setState('reqList');
      const result = (await request(
        'PocketTTN',
        {CurrShop: UserStore.podrazd.Id},
        {arrayAccessFormPaths: ['PocketTTN.TTN']},
      )) as ITTNlist;
      setList(result?.TTN ?? []);
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      setState('');
    }
  };

  const Cell = ({
    style,
    children,
  }: {
    style: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }) => (
    <View style={style}>
      <Text style={styles.colItem}>{children}</Text>
    </View>
  );

  const createTTN = async (codOb: string) => {
    try {
      if (!isMounted) return;
      if (!codOb) throw 'Не указан код объединения-получателя';
      setState('reqCreate');
      const result = (await request(
        'PocketTTN',
        {CurrShop: UserStore.podrazd.Id, CreateToOb: codOb},
        {arrayAccessFormPaths: ['PocketTTN.TTN']},
      )) as ITTNlist;
      if (isMounted) {
        setList(result?.TTN ?? []);

        if (result?.SelIndx)
          listRef?.current?.scrollToIndex(result?.SelIndx, true);
      }
    } catch (error) {
      if (isMounted) alertError(error);
    } finally {
      if (isMounted) setState('');
    }
  };

  const rowRenderer = React.useCallback(
    (_: any, item: ITTN) => {
      return (
        <TouchableOpacity
          style={item.Selected ? styles.rowLineSel : styles.rowLine}
          delayLongPress={300}
          onPress={() => {
            props.navigation.navigate('TtnWorkMode', {...item});
          }}>
          <Cell style={styles.col1}>{item.Flag}</Cell>
          <Cell style={styles.col2}>{item.DtNakl}</Cell>
          <Cell style={styles.col3}>{item.NumDoc}</Cell>
          <Cell style={styles.col4}>{item.ObFrom}</Cell>
          <Cell style={styles.col5}>{item.ObTo}</Cell>
          <Divider />
        </TouchableOpacity>
      );
    },
    [ttnList],
  );

  return (
    <ScreenTemplate {...props} title={'ТТН'}>
      <View
        style={{
          flex: 7,
          borderBottomWidth: 1,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <View style={[styles.header]}>
          <Cell style={styles.col1}>Ф</Cell>
          <Cell style={styles.col2}>Дата</Cell>
          <Cell style={styles.col3}>Номер</Cell>
          <Cell style={styles.col4}>Из</Cell>
          <Cell style={styles.col5}>В</Cell>
        </View>
        <RecycleList
          data={ttnList}
          customref={listRef}
          itemHeight={ITEM_HEiGHT}
          refreshing={state == 'reqList'}
          onRefresh={getTTNlist}
          _rowRenderer={rowRenderer}
        />
      </View>

      <SimpleButton
        containerStyle={{
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
        onPress={() => {
          setState('askCodOb');
        }}
        text="Добавить"
      />

      {state == 'askCodOb' || state == 'reqCreate' ? (
        <TtnCreateDlg
          onSubmit={createTTN}
          onCancel={() => setState('')}
          active={state == 'askCodOb'}
        />
      ) : null}
    </ScreenTemplate>
  );
};

export default TtnList;
