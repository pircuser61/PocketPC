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
import {alertActions, TOGGLE_SCANNING} from '../../../constants/funcrions';
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

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

const ItemsListPerepalech = observer(props => {
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
          dim.height = 80;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  useEffect(() => {
    return () => {
      PerepalechivanieStore.skipCheck = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      PerepalechivanieStore.skipCheck
        ? updateList()
        : (PerepalechivanieStore.skipCheck = true);
      return () => {
        //RBSheetRef.current.close();
        setMounted(true);
      };
    }, []),
  );

  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(PerepalechivanieStore.itemsList);

  const getShopName = (sas, namemaxidom) => {
    return sas.filter(r => r.palletNumber === namemaxidom)[0]?.$.CodShop;
  };

  function _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.FULL:
        return (
          <ListItemComponent
            {...props}
            data={data}
            onPress={() => {
              navigation.navigate('PerepalechItem', {
                mode: {name: 'Редактирование', isAdd: true},
                CodGood: data.$.CodGood,
              });
            }}
          />
        );
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

  const EquilQtyToFrom = (all = 'true') => {
    PocketPerepalDiff(
      PerepalechivanieStore.parrentId,
      all,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(typeof r);
        PerepalechivanieStore.checkQtyMergeList = r;
        RBSheetRef.current.close();
        setModalVisible(true);
        setLoading({
          checkAll: false,
          checkOnlyDbs: false,
          deleteDbs: false,
        });
      })
      .catch(e => {
        alertActions(e);
        setLoading({
          checkAll: false,
          checkOnlyDbs: false,
          deleteDbs: false,
        });
      });
  };

  const updateList = () => {
    PocketPerepalPalTo(
      PerepalechivanieStore.parrentId,
      PerepalechivanieStore.numpalFrom,
      '',
      PerepalechivanieStore.skipCheck,
      PerepalechivanieStore.palletsList,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        PerepalechivanieStore.itemsList = r;
        setRefreshing(false);
      })
      .catch(e => {
        alertActions(e);
        setRefreshing(false);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    updateList();
  }, []);

  const RBSheetRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  const createTwoButtonAlert = () =>
    Alert.alert('Удаление данных DBS', 'Вы хотите удалить данные DBS?', [
      {
        text: 'Отмена',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Да',
        onPress: () => {
          setLoading({...loading, deleteDbs: true});

          PocketPerepalClear(
            PerepalechivanieStore.parrentId,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              console.log(r);
              RBSheetRef.current.close();
              navigation.navigate('StartPerepalech');
              PerepalechivanieStore.resetStore();
            })
            .catch(e => {
              alertActions(e);
              setLoading({
                checkAll: false,
                checkOnlyDbs: false,
                deleteDbs: false,
              });
            });
        },
      },
    ]);

  return (
    <View style={styles.countainer}>
      <HeaderPriemka
        {...props}
        title={
          'Номер задания: ' +
          PerepalechivanieStore.numZadanya +
          '\nПаллета откуда: ' +
          PerepalechivanieStore.numpalFrom
        }
        onPressCenter={() => RBSheetRef.current.open()}
        needPressCenter={true}
      />

      <Divider />

      <ModalForCheckQty
        modalVisible={modalVisible}
        setModalVisible={r => setModalVisible(r)}
      />

      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            width: 40,
            textAlign: 'center',
            // backgroundColor: 'red',
          }}>
          М
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            width: 30,
            textAlign: 'center',
            // backgroundColor: 'red',
          }}>
          К.П.
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            width: 120,
            textAlign: 'center',
            // backgroundColor: 'red',
          }}>
          Код товара
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            width: 80,
            textAlign: 'center',
            //backgroundColor: 'red',
          }}>
          Паллета куда
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            width: 60,
            textAlign: 'center',
            // backgroundColor: 'red',
          }}>
          Кол-во
        </Text>
      </View>
      <Divider />
      {PerepalechivanieStore.itemsList.length ? (
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
              backgroundColor: '#313C47',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Text style={{color: 'white'}}>Обновить</Text>
          </TouchableOpacity>
        </>
      )}

      <ButtonBot
        disabled={false}
        title={'Добавить товар'}
        onPress={() => {
          navigation.navigate('PerepalechItem', {
            mode: {name: 'Добавление', isAdd: true},
            CodGood: '',
          });
        }}
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
          title={'Проверка расхождений\n(Все паллеты по заданию)'}
          onPress={() => {
            setLoading({...loading, checkAll: true});
            EquilQtyToFrom('true');
          }}
        />
        <View style={{height: 16}} />

        <BottomSheetButton
          loading={loading.checkOnlyDbs}
          title={'Проверка расхождений\n(Частично, по файлу DBS)'}
          onPress={() => {
            setLoading({...loading, checkOnlyDbs: true});

            EquilQtyToFrom('false');
          }}
        />

        <View style={{height: 16}} />
        <BottomSheetButton
          loading={loading.deleteDbs}
          title={'Очистить данные'}
          onPress={() => {
            createTwoButtonAlert();
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

export default connect(mapStateToProps)(ItemsListPerepalech);

const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
});
