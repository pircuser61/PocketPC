import {observer} from 'mobx-react-lite';
import React, {useEffect, useState, useRef} from 'react';
import {Alert, Button, StyleSheet, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import {RowElement} from '../../components/GlobalProverka/ProverkaListElement';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {BRIGHT_GREY} from '../../constants/funcrions';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import WorkWithCheckHook from '../../hooks/GlobalProverkaHooks/WorkWithCheckHook';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {GlobalCheckNavProps, ProvPalSpecsRow} from '../../types/types';

export type WorkWithCheckProps = NativeStackScreenProps<
  GlobalCheckNavProps,
  'WorkWithCheck'
>;

const WorkWithCheck = observer((props: WorkWithCheckProps) => {
  //<--------------ПЕРЕМЕННЫЕ-------------->

  const {
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
  } = WorkWithCheckHook(props);
  let mounted = true;
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  //<--------------ПЕРЕМЕННЫЕ/-------------->

  //<--------------ФУНКЦИИ-------------->

  const goCreate = () => {
    props.navigation.navigate('CreatePalletInCheckScreen', {
      NumNakl: props.route.params.item.ID ?? '',
      createDocument: createDocument,
    });
  };

  const createTwoButtonAlert = (item: ProvPalSpecsRow) =>
    Alert.alert(
      'Внимание!',
      'Что вы хотите сделать с документом №' + item.NumDoc + '?',
      [
        {
          text: 'Закрыть док.',
          onPress: () => changeStatus(item),
          style: 'default',
        },

        {
          text: 'Отмена',
          style: 'cancel',
        },
      ],
    );

  useEffect(() => {
    if (barcode.data) {
      scannedAction(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const renderItem = React.useCallback(
    (type: any, item: ProvPalSpecsRow) => (
      <TouchableOpacity
        //@ts-ignore
        style={{
          backgroundColor: item.NumDoc === choosen ? BRIGHT_GREY : null,
        }}
        delayLongPress={300}
        onLongPress={() => {
          setchoosen(item.NumDoc);
          if (CheckPalletsStore.Type !== '3') createTwoButtonAlert(item);
        }}
        onPress={() => {
          goToDocument(item);
        }}>
        <View
          style={{
            justifyContent: 'space-around',
            //alignItems: 'center',
            height: 100,
            borderBottomWidth: 0.4,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RowElement width={0.1} text={item.Stat + ''} />
            <RowElement width={0.1} text={item.Flag} />

            <RowElement width={0.1} text={item.DocInf} />
            <RowElement width={0.5} text={item.NumDoc} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <TitleAndDiscribe title={'Сектор'} discribe={item.Place?.Sector} />
            <TitleAndDiscribe title={'Этаж'} discribe={item.Place?.Floor} />
            <TitleAndDiscribe title={'Стелаж'} discribe={item.Place?.Rack} />
            <TitleAndDiscribe title={'Номер'} discribe={item.Place?.Place} />
          </View>
        </View>
      </TouchableOpacity>
    ),
    [list, choosen],
  );

  //<--------------ФУНКЦИИ/-------------->
  //<--------------ЭФФЕКТЫ-------------->

  //<--------------ЭФФЕКТЫ/-------------->

  return (
    <ScreenTemplate
      {...props}
      title={'Проверка №' + props.route?.params.item.ID}>
      {/* <Button
        title={'testscan'}
        onPress={() => {
          scannedAction('81862195');
        }}
      /> */}
      {loading && list.length === 0 ? (
        <LoadingFlexComponent />
      ) : error.length > 0 ? (
        <ErrorAndUpdateComponent error={error} update={getList} />
      ) : list.length > 0 ? (
        <RecycleList
          //onScroll={(event: any) => (conxt = event.nativeEvent.contentOffset.y)}
          onRefresh={getList}
          refreshing={loading}
          customref={ref}
          data={list}
          itemHeight={100}
          _rowRenderer={renderItem}
        />
      ) : (
        <View style={{flex: 1}}>
          <EmptyListComponent />
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <PressBotBar
          width={'50%'}
          onPress={() => {
            goCreate();
          }}
          title={'Добавить ' + CheckPalletsStore.Title.firstScreen}
        />
        <PressBotBar
          width={'50%'}
          onPress={changeFilter}
          disabled={loading}
          title={
            'Фильтр (' + (filter === 2 ? 'все' : filter === 1 ? '$' : '#') + ')'
          }
        />
      </View>
    </ScreenTemplate>
  );
});

export default WorkWithCheck;

const styles = StyleSheet.create({});
