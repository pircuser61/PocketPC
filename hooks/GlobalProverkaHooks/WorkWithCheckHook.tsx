import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {alertActions, timeout} from '../../constants/funcrions';
import {PocketProvSpecsCreate} from '../../functions/PocketProvSpecsCreate';
import {PocketProvSpecsList} from '../../functions/PocketProvSpecsList';
import {PocketProvSpecsState} from '../../functions/PocketProvSpecsState';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {WorkWithCheckProps} from '../../screens/ProverkaPallets/WorkWithCheck';
import {ProvPalSpecsRow} from '../../types/types';

const WorkWithCheckHook = (props: WorkWithCheckProps) => {
  const {navigation, route} = props;
  const {ID} = route.params.item;
  const [filter, setFilter] = useState<0 | 1 | 2>(0);
  const [list, setList] = useState<ProvPalSpecsRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [choosen, setchoosen] = useState('');
  const [error, setError] = useState('');

  const ref = useRef<any>(null);

  let mounted = true;

  function logMount() {
    console.log('МАУНТ:' + mounted);
  }

  const getList = async (needAlert = true) => {
    try {
      setLoading(true);
      setError('');
      const response = await PocketProvSpecsList({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        Shop: UserStore.podrazd.Id,
        Type: CheckPalletsStore.Type,
        Flag: filter === 2 ? 'all' : filter === 1 ? '$' : '#',
        NumNakl: ID,
      });

      if (mounted) {
        setList(response);
      } else logMount();
    } catch (error) {
      if (mounted) {
        if (list.length === 0) {
          setError(error + '');
        } else {
          if (needAlert) {
            alertActions(error);
          }
        }
      } else {
        console.log('Ошибка пришла:' + error + 'но экран размонтирован');
      }
    } finally {
      console.log('Экран' + mounted);

      if (mounted) {
        setLoading(false);
      }
    }
  };

  const changeFilter = () => {
    setFilter(pressFilter(filter));
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getList();
  //   }, [filter]),
  // );

  useEffect(() => {
    getList();
  }, [filter]);

  useEffect(() => {
    return () => {
      mounted = false;
      //console.log('Хук WorkWithCheckHook размонтирован! : ' + mounted);
    };
  }, []);

  const listWithNewItemLocal = (
    curlist: ProvPalSpecsRow[],
    item: ProvPalSpecsRow,
  ) => {
    return [...curlist, item].sort(
      (a: ProvPalSpecsRow, b: ProvPalSpecsRow) =>
        Number(a.NumDoc) - Number(b.NumDoc),
    );
  };

  const action = async ({
    newNumNakl,
    newList,
  }: {
    newNumNakl: string;
    newList: ProvPalSpecsRow[];
  }) => {
    try {
      setchoosen(newNumNakl);
      const nextIndex = getIndexOfDoc(newList, newNumNakl);
      //if (nextIndex.doc) goToDocument(nextIndex.doc);
      await timeout(150);
      if (nextIndex.idnext) scrollToIndex(nextIndex.idnext);
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToOffset = (from: number, to: number) => {
    ref?.current?.scrollToOffset(0, to);
  };

  const scrollToIndex = (index: number) => {
    ref?.current?.scrollToIndex(index, true);
  };

  const goToDocument = (document: ProvPalSpecsRow) => {
    setchoosen(document.NumDoc);
    props.navigation.navigate('DocumentCheckScreen', {
      item: {
        ...document,
        NumNakl: props.route?.params.item.ID ?? '',
      },
      action: () => getList(false),
    });
    // scrollToOffset(conxt, ((document?.id ?? 1) - 1) * 100 - 100);
    // conxt = ((document?.id ?? 1) - 1) * 100 - 100;
  };

  const getItemByNumDoc = (curList: ProvPalSpecsRow[], NumDoc: string) => {
    const ind = curList.findIndex(obj => obj.NumDoc === NumDoc);
    return ind;
  };

  const getIndexOfDoc = (array: ProvPalSpecsRow[], numdoc: string) => {
    'worklet';
    let idnext = 0;
    let doc = null;
    array.map((r, i) => {
      if (r.NumDoc === numdoc) {
        idnext = i;
        doc = r;
      }
    });
    return {idnext, doc};
  };

  const scannedAction = (barcode: string, needAlert = true) => {
    const index = getItemByNumDoc(list, barcode);
    if (index === -1) {
      createDocument({NumDoc: barcode, isNextScreen: false});
    } else if (index >= 0 && index <= list.length - 1) {
      setchoosen(barcode);
      scrollToIndex(index);
      if (needAlert)
        Alert.alert(
          'Внимание!',
          'Проверка №' + barcode + ' уже есть в списке!',
        );
    }
  };

  const createDocument = async ({
    NumDoc,
    isNextScreen = false,
  }: {
    NumDoc: string;
    isNextScreen?: boolean;
  }) => {
    try {
      setError('');
      setLoading(true);
      const response = await PocketProvSpecsCreate({
        City: UserStore.user?.['city.cod'],
        NumNakl: props.route?.params.item.ID,
        Type: CheckPalletsStore.Type,
        NumDoc: NumDoc,
        UID: UserStore.user?.UserUID,
      });

      const newList = listWithNewItemLocal(list, response);
      setList(newList);
      if (isNextScreen) {
        props.navigation.goBack();
      }
      action({newNumNakl: NumDoc, newList});
    } catch (error) {
      if (isNextScreen) {
        if ((error as String).includes('уже есть')) {
          Alert.alert(
            'Спозиционироваться?',
            'Документ ' + NumDoc + ' уже есть в списке!',
            [
              {text: 'Нет'},
              {
                text: 'Да',
                onPress: () => {
                  navigation.goBack();
                  scannedAction(NumDoc, false);
                  //action({newNumNakl: NumDoc, newList: list});
                },
              },
            ],
          );
        }
        throw error + '';
      } else alertActions(error + '');
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  const changeStatus = async (item: ProvPalSpecsRow) => {
    const newList = list.filter(r => r.NumDoc !== item.NumDoc);
    try {
      setLoading(true);
      const response = await PocketProvSpecsState({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        NumNakl: props.route?.params.item.ID ?? '',
        Type: CheckPalletsStore.Type,
        NumDoc: item.NumDoc,
      });

      setList(newList);
    } catch (error) {
      setList(listWithNewItemLocal(newList, item));
      alertActions(error);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  return {
    list,
    getList,
    loading,
    filter,
    changeFilter,
    choosen,
    ref,
    createDocument,
    setchoosen,
    goToDocument,
    scannedAction,
    changeStatus,
    error,
  };
};

export default WorkWithCheckHook;
const styles = StyleSheet.create({});

const pressFilter = (val: 0 | 1 | 2) => {
  switch (val) {
    case 0:
      return 1;
      break;
    case 1:
      return 2;
      break;
    case 2:
      return 0;
      break;
    default:
      return 0;
      break;
  }
};
