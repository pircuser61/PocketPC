import {observer} from 'mobx-react-lite';
import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import CardInItems from '../../../components/Perepalechivanie/CardInItems';
import ListItemComponent from '../../../components/Perepalechivanie/ListItemComponent';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {
  alertActions,
  MAIN_COLOR,
  TOGGLE_SCANNING,
} from '../../../constants/funcrions';
import {PocketPerepalPalTo} from '../../../functions/PocketPerepalPalTo';
import PerepalechivanieStore from '../../../mobx/PerepalechivanieStore';
import BotNavigation from '../PriemMestnyh/BotNavigation';
import {useFocusEffect} from '@react-navigation/native';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import RBSheet from 'react-native-raw-bottom-sheet';
import {createRef} from 'react';
import BottomSheetButton from '../../../components/Perepalechivanie/BottomSheetButton';
import {PocketPerepalClear} from '../../../functions/PocketPerepalClear';
import {PocketPerepalDiff} from '../../../functions/PocketPerepalDiff';
import ModalForCheckQty from '../../../components/Perepalechivanie/ModalForCheckQty';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackToPostavshikStore from '../../../mobx/BackToPostavshikStore';
import ItemInList from '../../../components/BackToPostavshik/ItemInList';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

const ItemListBackToPost = observer(props => {
  const {navigation, user} = props;
  let {width} = Dimensions.get('window');

  const _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FULL:
          dim.width = width;
          dim.height = 60;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  useEffect(() => {
    return () => {
      BackToPostavshikStore.skipCheck = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      BackToPostavshikStore.skipCheck
        ? updateList()
        : (BackToPostavshikStore.skipCheck = true);
      return () => {
        //RBSheetRef.current.close();
        setMounted(true);
      };
    }, []),
  );

  let dataProvider =
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    }).cloneWithRows(
      BackToPostavshikStore.specsrow?.map((r, i) => ({...r, id: i + 1})),
    ) ?? [];

  function _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.FULL:
        return <ItemInList {...props} data={data} />;
      default:
        return null;
    }
  }

  const [refreshing, setRefreshing] = React.useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState({
    checkAll: false,
    checkOnlyDbs: false,
    deleteDbs: false,
  });

  const updateList = () => {
    setRefreshing(true);

    BackToPostavshikStore.getSpecsList(
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
      () => {
        setRefreshing(false);
      },
      () => {
        setRefreshing(false);
      },
    );
  };

  const onRefresh = React.useCallback(() => {
    updateList();
  }, []);

  const RBSheetRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.countainer}>
      <HeaderPriemka
        {...props}
        title={
          BackToPostavshikStore.Filter.name +
          `\nНомер документа: ${BackToPostavshikStore.documentNumber}`
        }
        onPressCenter={() => RBSheetRef.current.open()}
        needPressCenter={true}
      />

      <Divider />

      <ModalForCheckQty
        modalVisible={modalVisible}
        setModalVisible={r => setModalVisible(r)}
      />

      <ItemInList
        {...props}
        disabled={true}
        data={{
          id: '№',
          $: {
            CodGood: 'Код товара',
            GoodQty: 'Кол-во',
            MarkQty: 'Кол. КМ',
            WoMarkQty: 'Без КМ',
          },
        }}
      />
      <Divider />
      {BackToPostavshikStore.specsrow.length ? (
        <RecyclerListView
          style={{marginBottom: 48}}
          layoutProvider={_layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={_rowRenderer}
          scrollViewProps={{
            refreshing: refreshing,
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
        />
      ) : (
        <>
          <Text
            style={{
              alignSelf: 'center',
              marginVertical: 16,
              fontWeight: 'bold',
            }}>
            Пусто
          </Text>
          <TouchableOpacity
            disabled={refreshing}
            onPress={onRefresh}
            style={{
              width: '90%',
              height: 48,
              alignSelf: 'center',
              backgroundColor: MAIN_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Text style={{color: 'white'}}>Обновить</Text>
          </TouchableOpacity>
        </>
      )}
      <ButtonBot
        title={'Назад'}
        onPress={() => navigation.goBack()}
        disabled={false}
      />

      <RBSheet
        ref={RBSheetRef}
        height={220}
        openDuration={200}
        //animationType={'none'}
        customStyles={{
          container: {
            wrapper: {
              backgroundColor: 'rgba(0,0,0,.6)',
            },
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: 'grey',
          },
        }}>
        <BottomSheetButton
          loading={loading.checkAll}
          title={'Требуется КМ'}
          onPress={() => {
            //setLoading({...loading, checkAll: true});
            BackToPostavshikStore.setFilter('1');
            RBSheetRef.current.close();
            updateList();
          }}
        />
        <View style={{height: 16}} />

        <BottomSheetButton
          loading={loading.checkOnlyDbs}
          title={'С расхождениями'}
          onPress={() => {
            //            setLoading({...loading, checkOnlyDbs: true});
            BackToPostavshikStore.setFilter('2');
            RBSheetRef.current.close();
            updateList();
          }}
        />

        <View style={{height: 16}} />
        <BottomSheetButton
          loading={loading.deleteDbs}
          title={'Все товары'}
          onPress={() => {
            BackToPostavshikStore.setFilter('3');
            RBSheetRef.current.close();
            updateList();
          }}
        />
      </RBSheet>
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(ItemListBackToPost);

const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
});

/**
 *   <ButtonBot
        disabled={false}
        title={'Добавить товар'}
        onPress={() => {
          navigation.navigate('BackToPostItem', {
            mode: {name: 'Добавление', isAdd: true},
            CodGood: '',
          });
        }}
      />
 */
