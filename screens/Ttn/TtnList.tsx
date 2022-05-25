import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import {alertError, SCREEN_WIDTH} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import TtnCreateDlg from './TtnCreateDlg';
import UserStore from '../../mobx/UserStore';
import useIsMounted from '../../customHooks/UseMountedHook';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';

const LI_HEIGHT = 66;
const ROW_HEGHT = 60;

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = SCREEN_WIDTH;
    dim.height = LI_HEIGHT;
  },
);
layoutProvider.shouldRefreshWithAnchoring = false;

interface ITTN {
  ID: string;
  Flag: string;
  DtNakl: string;
  NumDoc: string;
  ObFrom: string;
  ObTo: string;
}

interface ITTNlist {
  TTN: ITTN[];
  SelIndx?: number;
}

export const TtnList = (props: any) => {
  const [state, setState] = useState('request'); // как будто сразу делаем запрос, подождем useEffect
  const dpRef = useRef(new DataProvider((r1, r2) => r1 !== r2));
  const listRef = useRef<any>();
  const selRow = useRef(-1);
  const isMounted = useIsMounted();

  /* 
    нажать "добавить" и тут же тапнуть на списке 
    проваимся onPress, но state будет askCodOb, при возврате на данный экран
    новый render'а не произойдет, а прошлый рендер не случился из за смены экрана 
    - т.е. некоректное состояние
    если сделать просто переменную let disbaleOnpress то натыкаемся на "stale closure"
    либо реф либо выносить за пределы функции ...
  */
  const disableOnPress = useRef(false);
  disableOnPress.current = state == 'askCodOb';
  useEffect(() => {
    getTTNlist();
  }, []);

  let tm = Date.now();
  console.log(
    'TTN LIST RENDER state: ' +
      state +
      ' disabled ' +
      disableOnPress +
      ' ' +
      tm,
  );

  const getTTNlist = async (codOb?: string) => {
    try {
      if (!isMounted.current) return;
      if (codOb === '') throw 'Не указан код объединения-получателя';
      setState('request');
      const req = codOb
        ? {CurrShop: UserStore.podrazd.Id, CreateToOb: codOb}
        : {CurrShop: UserStore.podrazd.Id};
      const result = (await request('PocketTTN', req, {
        arrayAccessFormPaths: ['PocketTTN.TTN'],
      })) as ITTNlist;
      if (isMounted.current) {
        dpRef.current = dpRef.current.cloneWithRows(result?.TTN ?? []);
        selRow.current = result?.SelIndx ?? -1;
        setState('requestComplete');
        if (selRow.current >= 0)
          listRef?.current?.scrollToIndex(selRow.current, true);
      }
    } catch (error) {
      if (isMounted.current) {
        alertError(error);
        setState('error');
      }
    }
  };

  const rowRenderer = (_: any, item: ITTN, ix: number) => {
    // console.log('rowRender' + (Date.now() - tm));
    return (
      <TouchableOpacity
        style={selRow.current == ix ? styles.rowLineSel : styles.rowLine}
        delayLongPress={300}
        onPress={() => {
          if (!disableOnPress.current)
            props.navigation.navigate('TtnWorkMode', item);
        }}>
        <Cell flex={1}>{item.Flag}</Cell>
        <Cell flex={3}>{item.DtNakl}</Cell>
        <Cell flex={3}>{item.NumDoc}</Cell>
        <Cell flex={3}>{item.ObFrom}</Cell>
        <Cell flex={3}>{item.ObTo}</Cell>
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
        <TableHeader />
        {dpRef.current.getSize() > 0 ? (
          <RecyclerListView
            ref={listRef}
            layoutProvider={layoutProvider}
            dataProvider={dpRef.current}
            rowRenderer={rowRenderer}
            optimizeForInsertDeleteAnimations={false}
            scrollViewProps={{
              refreshControl: (
                <RefreshControl
                  refreshing={
                    false /* LoadingModalComponent покажет колесико, что бы было одинаково */
                  }
                  onRefresh={getTTNlist}
                />
              ),
            }}
          />
        ) : (
          <Text>Список пуст</Text>
        )}
      </View>

      <SimpleButton
        containerStyle={{
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
        onPress={() => {
          disableOnPress.current = true;
          setState('askCodOb');
        }}
        text="Добавить"
      />
      <LoadingModalComponent modalVisible={state === 'request'} />
      {state == 'askCodOb' ? (
        <TtnCreateDlg
          onSubmit={getTTNlist}
          onCancel={() => {
            setState('');
          }}
        />
      ) : null}
    </ScreenTemplate>
  );
};
//<LoadingModalComponent modalVisible={state === 'request'} />
export default TtnList;

const TableHeader = () => (
  <View style={styles.header}>
    <Cell flex={1}>Ф</Cell>
    <Cell flex={3}>Дата</Cell>
    <Cell flex={3}>Номер</Cell>
    <Cell flex={3}>Из</Cell>
    <Cell flex={3}>В</Cell>
  </View>
);

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
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },
  rowLineSel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },

  colItem: {fontSize: 18, textAlign: 'center'},
});
