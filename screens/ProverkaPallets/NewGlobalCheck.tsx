import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import {
  BRIGHT_GREY,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  timeout,
  x2js,
} from '../../constants/funcrions';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import BigList from 'react-native-big-list';
import {PalletInListCheck} from '../../types/types';
import ProverkaListElement from '../../components/GlobalProverka/ProverkaListElement';
import ModalForSearchPodrazd from '../../components/GlobalProverka/ModalForSearchPodrazd';
import UserStore from '../../mobx/UserStore';
import ModalForCreateNewCheck from '../../components/GlobalProverka/ModalForCreateNewCheck';
import ModalMenuGlobalCheck from '../../components/GlobalProverka/ModalMenuGlobalCheck';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import RecycleList from '../../components/SystemComponents/RecycleList';
import LoadingTextModal from '../../components/SystemComponents/LoadingTextModal';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const NewGlobalCheck = observer((props: any) => {
  //<--------------ПЕРЕМЕННЫЕ-------------->

  const [modalForFilterVisible, setmodalForFilterVisible] = useState(false);
  const [filter, setfilter] = useState('');
  const [choosen, setchoosen] = useState('');
  let mounted = true;
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const ref = useRef<any>(null);

  //<--------------ПЕРЕМЕННЫЕ/-------------->

  //<--------------ФУНКЦИИ-------------->

  const getList = () => {
    'worklet';
    CheckPalletsStore.get_list_of_items(UserStore.podrazd.Id);
  };

  const action = async (id: string) => {
    setchoosen(id);
    const res = await CheckPalletsStore.get_list_of_items(
      CheckPalletsStore.filtershop,
    );
    await timeout(150);
    scrollToBot();
  };

  const actionWorkLet = (id: string) => {
    'worklet';
    action(id);
  };

  const scrollToBot = () => {
    ref?.current.scrollToEnd();
  };

  const scrollToIndex = (index: number) => {
    ref?.current?.scrollToIndex(index);
  };

  const renderItem = React.useCallback(
    (type: any, item: PalletInListCheck) => (
      <TouchableOpacity
        //@ts-ignore
        style={{
          backgroundColor: item.ID === choosen ? BRIGHT_GREY : null,
        }}
        delayLongPress={300}
        onPress={() => {
          setchoosen(item.ID ?? '');
          props.navigation.navigate('WorkWithCheck', {
            item: item,
          });
        }}
        onLongPress={() => {
          setchoosen(item.ID ?? '');
          CheckPalletsStore.curretElement = item;
        }}>
        <ProverkaListElement {...item} />
      </TouchableOpacity>
    ),
    [CheckPalletsStore.list_of_elements, choosen],
  );

  const onClose = () => {
    'worklet';
    CheckPalletsStore.curretElement = null;
  };

  const getItemByNumDoc = (NumDoc: string) => {
    const ind = CheckPalletsStore.list_of_elements.findIndex(
      obj => obj.ID === NumDoc,
    );
    return ind;
  };

  const scrollToOffset = (from: number, to: number) => {
    ref?.current?.scrollToOffset(0, to);
  };

  //<--------------ФУНКЦИИ/-------------->

  //<--------------ЭФФЕКТЫ-------------->
  useEffect(() => {
    if (barcode.data) {
      // const index = getItemByNumDoc(barcode.data);
      // if (
      //   index >= 0 &&
      //   index <= CheckPalletsStore.list_of_elements.length - 1
      // ) {
      //   scrollToIndex(index);
      //   setchoosen(CheckPalletsStore.list_of_elements[index].ID ?? '');
      //   props.navigation.navigate('WorkWithCheck', {
      //     item: CheckPalletsStore.list_of_elements[index],
      //   });
      // }

      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    CheckPalletsStore.Type = props.route?.params.Type ?? '';
    let title = '';
    switch (props.route?.params.Type) {
      case '0':
      case '4':
      case '7':
      case '6':
        title = 'Паллет';
        CheckPalletsStore.Title = {
          firstScreen: 'паллету',
          secondScreen: 'паллеты',
          thirdScreen: 'Паллета',
          fourScreen: 'паллет',
        };
        break;
      case '1':
      case '5':
        title = 'Планограмм';
        CheckPalletsStore.Title = {
          firstScreen: 'планограмму',
          secondScreen: 'планограммы',
          thirdScreen: 'Планограмма',
          fourScreen: 'планограмм',
        };
        break;
      case '3':
        title = 'Акт брака';
        CheckPalletsStore.Title = {
          firstScreen: 'акт брака',
          secondScreen: 'акта брака',
          thirdScreen: 'Акт брака',
          fourScreen: 'актов брака',
        };
        break;
      case '2':
        title = 'Выкладк';
        CheckPalletsStore.Title = {
          firstScreen: 'выкладку',
          secondScreen: 'выкладки',
          thirdScreen: 'Выкладка',
          fourScreen: 'выкладок',
        };
        break;
      default:
        title = 'Документ';
        CheckPalletsStore.Title = {
          firstScreen: 'документ',
          secondScreen: 'документа',
          thirdScreen: 'Документ',
          fourScreen: 'документов',
        };
        break;
    }

    getList();
    return () => {
      CheckPalletsStore.resetStore();
      mounted = false;
    };
  }, []);

  //<--------------ЭФФЕКТЫ/-------------->

  return (
    <ScreenTemplate
      {...props}
      title={
        props.route?.params.title +
        ' ' +
        `(${
          CheckPalletsStore.filtershop.length > 0
            ? CheckPalletsStore.filtershop
            : 'все'
        })`
      }
      needsearchBar={true}
      value={filter}
      onClosePress={() => setfilter('')}
      onChangeText={setfilter}>
      {CheckPalletsStore.loading_list &&
      CheckPalletsStore.list_of_elements.length === 0 ? (
        <LoadingFlexComponent />
      ) : CheckPalletsStore.error_string.length > 0 ? (
        <ErrorAndUpdateComponent
          error={CheckPalletsStore.error_string}
          update={() => {
            CheckPalletsStore.get_list_of_items(CheckPalletsStore.filtershop);
          }}
        />
      ) : CheckPalletsStore.list_of_elements.filter(
          r => r.ID?.includes(filter) || r.UID?.includes(filter),
        ).length > 0 ? (
        <RecycleList
          onRefresh={() =>
            CheckPalletsStore.get_list_of_items(CheckPalletsStore.filtershop)
          }
          refreshing={CheckPalletsStore.loading_list}
          customref={ref}
          data={CheckPalletsStore.list_of_elements.filter(
            r => r.ID?.includes(filter) || r.UID?.includes(filter),
          )}
          itemHeight={60}
          _rowRenderer={renderItem}
        />
      ) : (
        <View style={{flex: 1}}>
          <EmptyListComponent />
        </View>
      )}
      <View style={{backgroundColor: MAIN_COLOR}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SCREEN_WIDTH,
          }}>
          <TouchableOpacity
            style={styles.botButtom}
            onPress={() => {
              props.navigation.navigate('CreateCheckScreen', {
                action: (id: string) => actionWorkLet(id),
              });
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Новая проверка
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botButtom,
              {flex: 0, width: 50, backgroundColor: MAIN_COLOR},
            ]}
            onPress={scrollToBot}>
            <MatIcon name="arrow-down" size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botButtom}
            onPress={() => setmodalForFilterVisible(true)}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Фильтр</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!!CheckPalletsStore.curretElement && (
        <ModalMenuGlobalCheck
          {...props}
          visible={!!CheckPalletsStore.curretElement}
          setmodalVisible={onClose}
        />
      )}
      {modalForFilterVisible && (
        <ModalForSearchPodrazd
          visible={modalForFilterVisible}
          setmodalVisible={setmodalForFilterVisible}
        />
      )}
    </ScreenTemplate>
  );
});

export default NewGlobalCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  wow: {
    backgroundColor: 'red',
    margin: 50,
    padding: 10,
    width: 100,
  },
  botButtom: {
    //width: SCREEN_WIDTH * 0.5,
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//
