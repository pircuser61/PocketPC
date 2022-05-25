import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {alertError, alertMsg} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import useIsMounted from '../../customHooks/UseMountedHook';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';

/*
TODO:
Выделение палетты  (подсветка созданной, )
*/

const LI_WITDH = 1000;
const LI_HEIGHT = 78;
const ROW_HEGHT = 70;

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
  indx: number;
}

interface IPalList {
  Palett: IPal[];
  SelIndx?: number;
  HasChecked?: string;
  Message?: string;
}

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);
layoutProvider.shouldRefreshWithAnchoring = false;

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

  const [inputVal, setInputVal] = useState('');
  const [state, setState] = useState('request');
  const listRef = useRef<any>();
  const dpRef = useRef(new DataProvider((r1, r2) => r1 !== r2));
  const currRow = useRef(-1);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (WorkMode === 'Check') getTTNpaletts({ReqdChecked: 'true'});
    else getTTNpaletts();
  }, []);

  console.log('RENDER: isMounted ' + isMounted.current + ' State: ' + state);

  const rowRenderer0 = (_: any, item: IPal, ix: number) => {
    //  console.log('ROW_RENDER0 ' + ix + ' ' + (Date.now() - initDt));

    return (
      <TouchableOpacity
        style={ix == currRow.current ? styles.selectedLI : styles.LI}
        delayLongPress={500}
        onLongPress={
          WorkMode === 'Edit'
            ? () => {
                currRow.current = ix;
                dpRef.current = dpRef.current.cloneWithRows(
                  dpRef.current.getAllData(),
                );
                setState('askDel');
              }
            : undefined
        }>
        <View style={{flexDirection: 'row'}}>
          <Cell flex={2}>{item.Flag} </Cell>
          <Cell flex={4}>{item.NumPal} </Cell>

          <Cell flex={3}>{item.DtZak} </Cell>
          <Cell flex={2}>{item.FlagZak} </Cell>
          <Cell flex={4}>{item.NumZak} </Cell>

          <Cell flex={5}>{item.NumPer} </Cell>
          <Cell flex={2}>{item.TypeDoc} </Cell>
          <Cell flex={3}>{item.ShopFrom} </Cell>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextLine label="Мест:" text={item.PlaceCount} />
          <TextLine label="Откуда:" text={item.FromShop} />
          <TextLine label="Куда:" text={item.ToShop} />
          <TextLine label="Отдел:" text={item.CodDep} />
          <TextLine label="Логист. палетт:" text={item.NumLogPal} />
          <TextLine label="Вес:" text={item.Weight} />
          <TextLine label="Сумма:" text={item.Amount} />
        </View>
      </TouchableOpacity>
    );
  };
  /*
  const rowRenderer2 = useCallback((_: any, item: IPal, ix: number) => {
    console.log('ROW_RENDER2 ' + ix + ' ' + (Date.now() - initDt));

    return (
      <TouchableOpacity style={styles.LI} delayLongPress={500}>
        <View style={{flexDirection: 'row'}}>
          <Cell flex={2}>{item.Flag} </Cell>
          <Cell flex={4}>{item.NumPal} </Cell>

          <Cell flex={3}>{item.DtZak} </Cell>
          <Cell flex={2}>{item.FlagZak} </Cell>
          <Cell flex={4}>{item.NumZak} </Cell>

          <Cell flex={5}>{item.NumPer} </Cell>
          <Cell flex={2}>{item.TypeDoc} </Cell>
          <Cell flex={3}>{item.ShopFrom} </Cell>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextLine label="Мест:" text={item.PlaceCount} />
          <TextLine label="Откуда:" text={item.FromShop} />
          <TextLine label="Куда:" text={item.ToShop} />
          <TextLine label="Отдел:" text={item.CodDep} />
          <TextLine label="Логист. палетт:" text={item.NumLogPal} />
          <TextLine label="Вес:" text={item.Weight} />
          <TextLine label="Сумма:" text={item.Amount} />
        </View>
      </TouchableOpacity>
    );
  }, []);
*/
  const getTTNpaletts = async (cmd?: object) => {
    try {
      setState('request');
      const req = {ID: params.ID, WorkMode};
      if (cmd) Object.assign(req, cmd);
      const result = (await request('PocketTTNpaletts', req, {
        arrayAccessFormPaths: ['PocketTTNpaletts.Palett'],
      })) as IPalList;

      currRow.current = result?.SelIndx ?? -1;
      dpRef.current = dpRef.current.cloneWithRows(result?.Palett ?? []);
      // console.log(result);
      // console.log(dpRef.current.getSize());

      const hasChecked = result?.HasChecked?.toLowerCase() === 'true' ?? false;
      if (isMounted.current) {
        if (currRow.current > -1)
          listRef?.current?.scrollToIndex(currRow.current, true);

        if (result?.Message) alertMsg(result?.Message);
        if (hasChecked) setState('askClear');
        else setState('RequestComplete');
      }
    } catch (error) {
      if (isMounted.current) {
        setState('RequestError');
        alertError(error);
      }
    }
  };

  const ClearCheckDlg = () => {
    return (
      <SimpleDlg>
        <SimpleButton onPress={() => setState('')} text="Продолжить пересчет" />
        <SimpleButton
          onPress={() => getTTNpaletts({Clear: 'true'})}
          text="Начать пересчет (обнулить)"
        />
      </SimpleDlg>
    );
  };

  const DeleteDlg = () => {
    const item = dpRef.current.getDataForIndex(currRow.current);
    const onCancel = () => setState('cancelDelete');

    if (item.NumLogPal == '0' || item.NumLogPal == '') {
      const onSubmit = () => getTTNpaletts({DeletePal: item.Id});
      return (
        <SimpleDlg onSubmit={onSubmit} onCancel={onCancel}>
          <Text style={styles.labelText}>
            {'Удалить палетт ' + item.NumPal + '?'}
          </Text>
        </SimpleDlg>
      );
    } else {
      const onSubmit = () => getTTNpaletts({DeleteList: item.NumLogPal});
      return (
        <SimpleDlg onSubmit={onSubmit} onCancel={onCancel}>
          <Text style={styles.labelText}>
            {'Палетт ' +
              item.NumPal +
              ' добавлен в Лог.Палетт ' +
              item.NumLogPal}
          </Text>

          <Text style={styles.labelText}>{'Удалить Весь Лог.Палетт?'}</Text>
        </SimpleDlg>
      );
    }
  };
  /* 
  из за широкого View на listView не видно индикатора refresh-control'a,
  поэтому в RecyclerListVeiw не используется 

  на внешний scrollview перенсти нельзя, он глючит - свайп вниз всегда считает обновлением, 
  т.к. сам горизонтальный и о положении вертикального не знает
      
*/
  // console.log('RETURN ' + (Date.now() - initDt));
  return (
    <ScreenTemplate {...props} title={title}>
      <View style={styles.view1}>
        <ScanInput
          placeholder="Поиск по баркоду"
          value={inputVal}
          onSubmit={() => getTTNpaletts({NumPal: inputVal})}
          setValue={setInputVal}></ScanInput>
      </View>
      <ScrollView horizontal={true}>
        <View style={styles.view2}>
          <TableHeader />
          {dpRef.current.getSize() > 0 ? (
            <RecyclerListView
              ref={listRef}
              layoutProvider={layoutProvider}
              dataProvider={dpRef.current}
              rowRenderer={rowRenderer0}
              optimizeForInsertDeleteAnimations={false}
            />
          ) : (
            <Text>Список пуст</Text>
          )}
        </View>
      </ScrollView>

      <SimpleButton
        text="Обновить"
        onPress={getTTNpaletts}
        containerStyle={styles.updateButton}
      />
      <LoadingModalComponent modalVisible={state === 'request'} />
      {state === 'askDel' ? (
        <DeleteDlg />
      ) : state === 'askClear' ? (
        <ClearCheckDlg />
      ) : null}
    </ScreenTemplate>
  );
};

export default TtnPaletts;

const Cell = ({flex, children}: {flex: number; children?: React.ReactNode}) => (
  <View style={{flex: flex}}>
    <Text style={styles.colItem}>{children}</Text>
  </View>
);

const TableHeader = () => (
  <View style={styles.ListHeader}>
    <Cell flex={2}>Ф</Cell>
    <Cell flex={4}>Палетт</Cell>

    <Cell flex={3}>Дата</Cell>
    <Cell flex={2}>Ф</Cell>
    <Cell flex={4}>N Зак</Cell>

    <Cell flex={5}>Пер.Накл.</Cell>
    <Cell flex={2}>Тип</Cell>
    <Cell flex={3}>Из подр</Cell>
  </View>
);

const TextLine = ({label, text}: {label: string; text: string}) => (
  <View style={{flexDirection: 'row'}}>
    <Text style={styles.textLineLable}>{label}</Text>
    <Text style={styles.textLineText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  // что бы не плыли колонки нужно задвать явно ширину и ушапки и у строк
  ListHeader: {
    width: LI_WITDH,
    flexDirection: 'row',
    backgroundColor: '#D1D1D1',
  },
  LI: {
    width: LI_WITDH,
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },
  selectedLI: {
    width: LI_WITDH,
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },

  colItem: {fontSize: 20, textAlign: 'center'},
  labelText: {
    paddingTop: 10,
    fontSize: 18,
  },

  textLineLable: {fontSize: 18, fontWeight: 'bold', paddingRight: 10},
  textLineText: {fontSize: 18, paddingRight: 20},
  view1: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  view2: {
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },

  updateButton: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});
