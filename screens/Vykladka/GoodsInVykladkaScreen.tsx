import {observer} from 'mobx-react-lite';
import {Flex} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import {FirstCell} from '../../components/GlobalProverka/FirstCell';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import WhiteCardForInfo from '../../components/SystemComponents/WhiteCardForInfo';
import SwitchScreensForGood from '../../components/VykladkaComponents/SwitchScreensForGood';
import {MAIN_COLOR} from '../../constants/funcrions';
import {
  GoodsRow,
  PocketProvfreeGoods,
} from '../../functions/PocketProvfreeGoods';
import GoodsInVykladkaHook from '../../hooks/VykladkaHooks/GoodsInVykladkaHook';
import {VykladkaNavProps} from '../../navigation/Vykladka/VykladkaNav';
import Feather from 'react-native-vector-icons/Feather';
import {IconButtonBottom} from '../Planogramma/PlanogrammaStart';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import ChangeGoodQtyCheckModal from '../../components/GlobalProverka/ChangeGoodQtyCheckModal';
import ChangeGoodQtyVykladkaModal from '../../components/VykladkaComponents/ChangeGoodQtyVykladkaModal';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';

export type GoodsInVykladkaScreenProps = NativeStackScreenProps<
  VykladkaNavProps,
  'GoodsInVykladkaScreen'
>;

const GoodsInVykladkaScreen = observer((props: GoodsInVykladkaScreenProps) => {
  const [canEdit, setcanEdit] = useState(false);
  const [showMenu, setshowMenu] = useState(true);

  if (!showMenu) {
    return <GoodsInVykladkaScreen1 {...props} canEdit={canEdit} />;
  }

  return (
    <ScreenTemplate {...props} title="Выкладка">
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: 16,
        }}>
        <MenuListComponent
          data={[
            {
              action: () => {
                setcanEdit(true);
                setshowMenu(false);
              },
              title: 'Редактировать',
              icon: 'edit',
            },
            {
              action: () => {
                setcanEdit(false);
                setshowMenu(false);
              },
              title: 'Просмотр',
              icon: 'eye',
            },
            // {action: () => {}, title: 'Обнулить', icon: 'retweet'},
          ]}
        />
      </View>
    </ScreenTemplate>
  );
});

const GoodsInVykladkaScreen1 = observer(
  (props: GoodsInVykladkaScreenProps & {canEdit: boolean}) => {
    const {canEdit} = props;
    const {
      goodInfo,
      getGoodInfo,
      loading,
      getFirst,
      getLast,
      getPrev,
      getNext,
      miniError,
      error,
      relativePosition,
      addOrFindGood,
      setGoodInfo,
    } = GoodsInVykladkaHook({
      ...props,
      NumNakl: props.route.params.propitem.NumNakl,
      canEdit,
    });

    const [mode, setMode] = useState<'-1' | '0' | '1' | null>(null);
    const listItems = [0, 1, 2, 3, 4, 5, 6];
    const [index, setIndex] = useState(0);
    const _api = PriemMestnyhHook();
    const {barcode, setBarcode} = _api;

    useEffect(() => {
      if (barcode.data) {
        addOrFindGood(barcode.data);
        setBarcode({data: '', time: '', type: ''});
      }
    }, [barcode]);

    const scrollToNextElement = React.useCallback(() => {
      if (index < listItems.length - 1) {
        const newIndex = index + 1;

        setIndex(newIndex);
        //setrenderfrom(newIndex);
        return;
      }
      if (index === listItems.length - 1) {
        const newIndex = 0;
        setIndex(newIndex);
        //setrenderfrom(newIndex);
        return;
      }
    }, [index]);

    const plusFunction = React.useCallback(() => {
      if (canEdit) setMode('1');
    }, [mode]);

    const minusFunction = React.useCallback(() => {
      if (canEdit) setMode('-1');
    }, [mode]);

    const changeQtyFunction = React.useCallback(() => {
      if (canEdit) setMode('0');
    }, [mode]);

    const goToCreateOrFind = () => {
      props.navigation.navigate('AddOrFindGood', {
        action: str => addOrFindGood(str, true),
        title: canEdit ? 'Добавление товара' : 'Поиск товара',
        inputtitle: 'Баркод',
        bot: canEdit ? 'Добавить' : 'Найти',
      });
    };

    return (
      <ScreenTemplate {...props} title="Товары выкладка">
        {loading ? (
          <LoadingFlexComponent />
        ) : goodInfo ? (
          <View style={{flex: 1}}>
            <WhiteCardForInfo
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 16,
              }}>
              <Text style={{fontWeight: 'bold'}}>{goodInfo?.KatFlag}</Text>
              <Text style={{fontWeight: 'bold'}}>{goodInfo?.CodGood}</Text>
              <Text style={{fontWeight: 'bold'}}>{goodInfo?.ShopQty}</Text>
              <Text style={{fontWeight: 'bold'}}>{goodInfo?.Qty}</Text>
            </WhiteCardForInfo>
            <SwitchScreensForGood
              goodInfo={goodInfo}
              index={index}
              listItems={listItems}
            />
            <TouchableOpacity onPress={scrollToNextElement}>
              <WhiteCardForInfo
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 16,
                  margin: 16,
                  backgroundColor: MAIN_COLOR,
                }}>
                <TitleAndDiscribe
                  title={'Б'}
                  discribe={goodInfo.ScanBarCod}
                  color="white"
                />

                <TitleAndDiscribe
                  title={'К'}
                  color="white"
                  discribe={goodInfo.ScanBarQuant}
                />
              </WhiteCardForInfo>
            </TouchableOpacity>
            {goodInfo !== null && (
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  padding: 16,
                }}>
                <TouchableOpacity
                  disabled={!canEdit}
                  style={[
                    styles.buttonCircle,
                    {
                      opacity: canEdit ? 1 : 0.7,
                    },
                  ]}
                  onPress={changeQtyFunction}>
                  <Feather name="edit-2" size={20} color="white" />
                </TouchableOpacity>
                <View style={{width: 16}} />
                <TouchableOpacity
                  disabled={!canEdit}
                  style={[
                    styles.buttonCircle,
                    {
                      opacity: canEdit ? 1 : 0.7,
                    },
                  ]}
                  onPress={minusFunction}>
                  <Feather name="minus" size={20} color="white" />
                </TouchableOpacity>
                <View style={{width: 16}} />
                <TouchableOpacity
                  disabled={!canEdit}
                  style={[
                    styles.buttonCircle,
                    {
                      opacity: canEdit ? 1 : 0.7,
                    },
                  ]}
                  onPress={plusFunction}>
                  <Feather name="plus" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <EmptyFlexComponent />
        )}
        {miniError.length > 0 ? (
          <>
            <View style={{height: 16}} />
            <WhiteCardForInfo>
              <Text style={{color: 'red'}}>{miniError}</Text>
            </WhiteCardForInfo>
          </>
        ) : null}
        <View style={styles.buttonbar}>
          <IconButtonBottom onPress={getFirst} iconName="chevrons-left" />
          <IconButtonBottom
            onPress={getPrev}
            iconName="chevron-left"
            opacity={
              goodInfo?.CodGood === relativePosition.first?.CodGood ? 0 : 1
            }
          />
          <IconButtonBottom
            onPress={goToCreateOrFind}
            iconName={canEdit ? 'plus' : 'search'}
          />
          <IconButtonBottom
            opacity={
              goodInfo?.CodGood === relativePosition.last?.CodGood ? 0 : 1
            }
            onPress={getNext}
            iconName="chevron-right"
          />
          <IconButtonBottom onPress={getLast} iconName="chevrons-right" />
        </View>

        {mode && (
          <ChangeGoodQtyVykladkaModal
            setGoodInfo={setGoodInfo}
            goodInfo={goodInfo as GoodsRow}
            visible={mode === '-1' || mode === '0' || mode === '1'}
            mode={mode}
            setmodalVisible={() => {
              setMode(null);
            }}
          />
        )}
      </ScreenTemplate>
    );
  },
);

export default GoodsInVykladkaScreen;

const styles = StyleSheet.create({
  navigationArrows: {
    height: 60,
    width: 60,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  buttonbar: {
    backgroundColor: MAIN_COLOR,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
