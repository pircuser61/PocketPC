import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Divider} from 'react-native-paper';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';

import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import useIsMounted from '../../customHooks/UseMountedHook';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

/*

TODO:
НЕТ индикации во время запроса, пока воткнул       <LoadingModalComponent modalVisible={state === 'request'} />
+++ Диалог удаления палетта/списка палетт
+++ Удаление палетт из списка ()
Выделение палетты  (подсветка созданной, )
Привести интерфейс в порядок

*/

const LI_HEIGHT = 66;
const LI_WITDH = 1600;
const ROW_HEGHT = 60;

const styles = StyleSheet.create({
  header: {flexDirection: 'row', width: LI_WITDH, backgroundColor: '#D1D1D1'},
  rowLine: {
    flexDirection: 'row',
    width: LI_WITDH,
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },
  selectedLine: {
    flexDirection: 'row',
    width: LI_WITDH,
    alignItems: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },
  col1: {flex: 3},
  col2: {flex: 4},
  col15: {flex: 6},
  colItem: {fontSize: 18, textAlign: 'center'},
  labelText: {
    paddingTop: 10,
    fontSize: 18,
  },
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
  Id: string;
}

interface IPalList {
  Palett: IPal[];
  SelIndx?: number;
}

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);
layoutProvider.shouldRefreshWithAnchoring = false;

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

const TableHeader = () => (
  <View style={styles.header}>
    <Cell style={styles.col1}>Ф</Cell>
    <Cell style={styles.col2}> Палетт</Cell>
    <Cell style={styles.col2}> Дата</Cell>
    <Cell style={styles.col2}> Ф</Cell>
    <Cell style={styles.col2}> N Зак</Cell>
    <Cell style={styles.col2}> Отдел</Cell>
    <Cell style={styles.col2}> Откуда</Cell>
    <Cell style={styles.col2}> Куда</Cell>
    <Cell style={styles.col2}> Мест</Cell>
    <Cell style={styles.col2}> Вес по ТОРГ13</Cell>
    <Cell style={styles.col2}> Сумма по ТОРГ13</Cell>
    <Cell style={styles.col2}> Пер.Накл.</Cell>
    <Cell style={styles.col2}> Тип</Cell>
    <Cell style={styles.col2}> Из подр</Cell>
    <Cell style={styles.col15}> Логист. палетт </Cell>
  </View>
);

let initDt = Date.now();
export const TtnPaletts = (props: any) => {
  initDt = Date.now();

  const params = props.route.params;
  const WorkMode = params.workMode;
  const workModeName =
    WorkMode === 'Edit'
      ? 'Редактирование'
      : WorkMode === 'Check'
      ? 'Проверка'
      : 'Просмотр';

  const title =
    'N ' +
    params?.NumDoc +
    ' ' +
    params?.ObFrom +
    ' > ' +
    params?.ObTo +
    ' ' +
    workModeName;

  const [state, setState] = useState('');
  const listRef = useRef<any>();
  const dataProviderRef = useRef(new DataProvider((r1, r2) => r1 !== r2));
  const [inputVal, setInputVal] = useState('5339311');
  const isMounted = useIsMounted();
  const currRow = useRef(-1);

  console.log('RENDER: isMounted ' + isMounted.current + ' State: ' + state);

  useEffect(() => {
    getTTNpaletts();
  }, []);

  const getTTNpaletts = async (Cmd?: string) => {
    try {
      if (!isMounted.current) {
        console.log('\x1b[1;31m', 'NOT MOUNTED!!!');
        return;
      }

      setState('request');
      const req =
        Cmd === 'Find'
          ? {ID: params.ID, NumPal: inputVal, WorkMode}
          : Cmd === 'DelPal'
          ? {ID: params.ID, DeletePal: currRow.current, WorkMode}
          : Cmd === 'DelPlist'
          ? {ID: params.ID, DeletePlist: currRow.current, WorkMode}
          : {ID: params.ID, WorkMode};
      console.log(Cmd + ' ' + currRow);
      const result = (await request('PocketTTNpaletts', req, {
        arrayAccessFormPaths: ['PocketTTN.TTN'],
      })) as IPalList;
      const data = result?.Palett ?? [];
      currRow.current = result?.SelIndx ?? -1;

      dataProviderRef.current = dataProviderRef.current.cloneWithRows(data);

      if (isMounted.current) {
        if (currRow.current > -1)
          listRef?.current?.scrollToIndex(currRow.current, true);
        setState('RequestComplete');
      }
    } catch (error) {
      if (isMounted.current) {
        setState('RequestError');
        alertError(error);
      }
    }
  };

  const rowRenderer = (_: any, item: IPal, ix: number) => {
    console.log('ROW_RENDER ' + item.NumPal + ' ' + (Date.now() - initDt));

    return (
      <TouchableOpacity
        style={ix == currRow.current ? styles.selectedLine : styles.rowLine}
        delayLongPress={500}
        onLongPress={
          WorkMode === 'Edit'
            ? () => {
                currRow.current = ix;
                setState('askDel');
              }
            : undefined
        }>
        <Cell style={styles.col1}>{item.Flag} </Cell>
        <Cell style={styles.col2}>{item.NumPal} </Cell>
        <Cell style={styles.col2}>{item.DtZak} </Cell>
        <Cell style={styles.col2}>{item.FlagZak} </Cell>
        <Cell style={styles.col2}>{item.NumZak} </Cell>
        <Cell style={styles.col2}>{item.CodDep} </Cell>
        <Cell style={styles.col2}>{item.FromShop} </Cell>
        <Cell style={styles.col2}>{item.ToShop} </Cell>
        <Cell style={styles.col2}>{item.PlaceCount} </Cell>
        <Cell style={styles.col2}>{item.Weight} </Cell>
        <Cell style={styles.col2}>{item.Amount} </Cell>
        <Cell style={styles.col2}>{item.NumPer} </Cell>
        <Cell style={styles.col2}>{item.TypeDoc} </Cell>
        <Cell style={styles.col2}>{item.ShopFrom} </Cell>
        <Cell style={styles.col15}>{item.NumLogPal} </Cell>
        <Divider />
      </TouchableOpacity>
    );
  };

  const DeleteDlg = () => {
    const item = dataProviderRef.current.getDataForIndex(currRow.current);
    const onSubmit = () => getTTNpaletts('DelPal');
    const onCancel = () => setState('cancelDelete');

    if (item.NumLogPal == '0' || item.NumLogPal == '')
      return (
        <SimpleDlg onSubmit={onSubmit} onCancel={onCancel}>
          <Text style={styles.labelText}>
            {'Удалить палетт ' + item.NumPal + '?'}
          </Text>
        </SimpleDlg>
      );

    return (
      <SimpleDlg onSubmit={onSubmit} onCancel={onCancel}>
        <Text style={styles.labelText}>
          {'Палетт ' + item.NumPal + ' добавлен в Лог.Палетт ' + item.NumLogPal}
        </Text>

        <Text style={styles.labelText}>{'Удалить Весь Лог.Палетт?'}</Text>
      </SimpleDlg>
    );
  };

  return (
    <ScreenTemplate {...props} title={title}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}>
        <ScanInput
          placeholder="Поиск по баркоду"
          value={inputVal}
          onSubmit={() => getTTNpaletts('Find')}
          setValue={setInputVal}></ScanInput>
      </View>
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

          {dataProviderRef.current.getSize() > 0 ? (
            <RecyclerListView
              ref={listRef}
              layoutProvider={layoutProvider}
              dataProvider={dataProviderRef.current}
              rowRenderer={rowRenderer}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={state === 'request'}
                    onRefresh={getTTNpaletts}
                  />
                ),
              }}
              optimizeForInsertDeleteAnimations={true}
            />
          ) : (
            <Text>Список пуст</Text>
          )}
        </View>
      </ScrollView>
      <LoadingModalComponent modalVisible={state === 'request'} />
      <SimpleButton
        text="Обновить"
        onPress={getTTNpaletts}
        containerStyle={{marginLeft: 10, marginRight: 10}}></SimpleButton>

      {state === 'askDel' ? <DeleteDlg /> : null}
    </ScreenTemplate>
  );
};

export default TtnPaletts;
