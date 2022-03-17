import {observer} from 'mobx-react-lite';
import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import CustomModalComponent from '../../components/SystemComponents/CustomModalComponent';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import FilterModalVykladka from '../../components/VykladkaComponents/FilterModalVykladka';
import {BRIGHT_GREY} from '../../constants/funcrions';
import {ProvfreeRow} from '../../functions/PocketProvfreeList';
import VykladkaStartHook from '../../hooks/VykladkaHooks/VykladkaStartHook';
import {VykladkaNavProps} from '../../navigation/Vykladka/VykladkaNav';

const ITEM_HEIGHT = 60;

type Props = NativeStackScreenProps<VykladkaNavProps, 'VykladkaStart'>;

const VykladkaStart = observer((props: Props) => {
  const {
    list,
    loading,
    filter,
    ref,
    filterModal,
    setfilter,
    openFilter,
    closeFilter,
    addNewElementToList,
    setchossen,
    chossen,
    getList,
    changeElementInList,
  } = VykladkaStartHook();

  const renderItem = React.useCallback(
    (type: any, item: ProvfreeRow) => {
      return (
        <TouchableOpacity
          onLongPress={() => {
            setchossen(item.NumNakl);
            props.navigation.navigate('AddNewVykladla', {
              addNewElementToList,
              changeElementInList,
              mode: 'edit',
              propitem: item,
            });
          }}
          onPress={() => {
            setchossen(item.NumNakl);
            props.navigation.navigate('GoodsInVykladkaScreen', {
              propitem: item,
            });
          }}
          style={{
            height: 60,
            paddingLeft: 16,
            backgroundColor: chossen === item.NumNakl ? BRIGHT_GREY : undefined,
          }}>
          <View style={{paddingRight: 16}}>
            <View
              style={{
                height: ITEM_HEIGHT - 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 16,
              }}>
              <Text style={{paddingRight: 16}} numberOfLines={1}>
                {item.Comment}
              </Text>

              <Text style={{fontWeight: 'bold'}}>{item.Uid}</Text>
            </View>
          </View>
          <Divider />
        </TouchableOpacity>
      );
    },
    [list, chossen],
  );

  const Header = () => (
    <TouchableOpacity style={{height: 30, paddingLeft: 16}}>
      <View style={{paddingRight: 16}}>
        <View
          style={{
            height: 30 - 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: 16,
          }}>
          <Text style={{paddingRight: 16, fontWeight: 'bold'}}>Примечание</Text>

          <Text style={{fontWeight: 'bold'}}>Кто</Text>
        </View>
      </View>

      <Divider />
    </TouchableOpacity>
  );

  return (
    <ScreenTemplate {...props} title={'Проверка выкладки'}>
      <View style={{flex: 1}}>
        {loading && list.length === 0 ? (
          <LoadingFlexComponent />
        ) : list.length > 0 ? (
          <RecycleList
            Header={Header}
            data={list}
            customref={ref}
            refreshing={loading}
            itemHeight={ITEM_HEIGHT}
            onRefresh={() => getList(filter)}
            _rowRenderer={renderItem}
          />
        ) : (
          <EmptyFlexComponent text="Список пуст" />
        )}
      </View>
      <View style={{flexDirection: 'row'}}>
        <PressBotBar
          width="50%"
          title={'Добавить'}
          onPress={() => {
            props.navigation.navigate('AddNewVykladla', {
              addNewElementToList,
              changeElementInList,
              mode: 'create',
            });
          }}
        />
        <PressBotBar
          width="50%"
          title={filter.FilterShop + ' Подр.  ' + filter.FilterUid + ' Польз.'}
          onPress={openFilter}
        />
      </View>
      {filterModal && (
        <FilterModalVykladka
          currentFilter={filter}
          getList={getList}
          setmodalVisible={() => closeFilter()}
          visible={filterModal}
        />
      )}
    </ScreenTemplate>
  );
});

export default VykladkaStart;

const styles = StyleSheet.create({});
