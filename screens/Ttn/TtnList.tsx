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

  //console.log('TTN LIST RENDER state: ' + state);

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

  const rowRenderer = (_: any, item: ITTN) => {
    return (
      <TouchableOpacity
        style={item.Selected ? styles.rowLineSel : styles.rowLine}
        delayLongPress={300}
        onPress={() => {
          props.navigation.navigate('TtnWorkMode', {...item});
        }}>
        <Cell flex={1}>{item.Flag}</Cell>
        <Cell flex={3}>{item.DtNakl}</Cell>
        <Cell flex={3}>{item.NumDoc}</Cell>
        <Cell flex={3}>{item.ObFrom}</Cell>
        <Cell flex={3}>{item.ObTo}</Cell>
        <Divider />
      </TouchableOpacity>
    );
  };

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
          <Cell flex={1}>Ф</Cell>
          <Cell flex={3}>Дата</Cell>
          <Cell flex={3}>Номер</Cell>
          <Cell flex={3}>Из</Cell>
          <Cell flex={3}>В</Cell>
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

const Cell = ({flex, children}: {flex: number; children?: React.ReactNode}) => (
  <View style={{flex: flex}}>
    <Text style={styles.colItem}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {flexDirection: 'row', backgroundColor: '#D1D1D1'},
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    height: ROW_HEGHT,
  },
  rowLineSel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },

  colItem: {fontSize: 18, textAlign: 'center'},
});
