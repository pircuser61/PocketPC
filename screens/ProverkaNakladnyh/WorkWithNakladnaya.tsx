import {observer} from 'mobx-react-lite';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {PocketProvperSpecs} from '../../functions/PocketProvperSpecs';
import UserStore from '../../mobx/UserStore';
import {
  NakladnayaSpeckInterface,
  ProverkaNakladnyhNavProps,
  ProvperSpecsRow,
} from '../../types/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {alertActions, MAIN_COLOR} from '../../constants/funcrions';
import BottomActionBar from '../../components/ProverkaNakladnyh/BottomActionBar';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import WhiteCardForInfo from '../../components/SystemComponents/WhiteCardForInfo';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import EmptyFlexComponent from '../../components/SystemComponents/EmptyFlexComponent';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'WorkWithNakladnaya'
>;

const WorkWithNakladnaya = observer((props: Props) => {
  //<--------------ПЕРЕМЕННЫЕ-------------->
  const [specsInfo, setspecsInfo] = useState<null | ProvperSpecsRow>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [miniError, setminiError] = useState('');
  const [isFilter, setIsFilter] = useState<'false' | 'true'>('false');
  const [relativePosition, setRelativePosition] = useState<{
    first?: ProvperSpecsRow;
    last?: ProvperSpecsRow;
  }>({});

  let mounted = true;

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  //<--------------ПЕРЕМЕННЫЕ/-------------->

  //<--------------ФУНКЦИИ-------------->

  const goToGoodsList = () => {
    props.navigation.navigate('GoodsListScreenInProverka', {
      NumNakl: specsInfo?.NumNakl ?? '',
      NumProv: props.route.params.NumProv,
      getCurrNakladnaya,
    });
  };

  const switchFilter = () => {
    if (isFilter === 'false') {
      setIsFilter('true');
    } else if (isFilter === 'true') {
      setIsFilter('false');
    }
  };

  const getInfo = useCallback(
    async ({
      Cmd,
      NumNakl,
      isSecondScreen = false,
      isFilter,
    }: NakladnayaSpeckInterface) => {
      try {
        if (isSecondScreen) {
          props.navigation.goBack();
        }
        setError('');
        setminiError('');
        setLoading(true);
        const response = await PocketProvperSpecs({
          City: UserStore.user?.['city.cod'],
          Cmd: Cmd,
          CodShop: UserStore.podrazd.Id,
          NumProv: props.route.params.NumProv,
          NumNakl: NumNakl ?? '',
          UID: UserStore.user?.UserUID,
          FilterDiff: isFilter,
        });
        if (mounted) {
          setspecsInfo(response);
        }

        switch (Cmd) {
          case 'first':
            setRelativePosition({...relativePosition, first: response});
            break;
          case 'last':
            setRelativePosition({...relativePosition, last: response});
            break;
          case 'curr':
            console.log(response + Cmd);
            break;
          case 'create':
            console.log(response + Cmd);
            break;
          default:
            break;
        }
      } catch (err) {
        if (typeof err === 'string') {
          const error = err + '';

          if (error === 'Вы в конце списка') {
            setRelativePosition({
              ...relativePosition,
              last: specsInfo as ProvperSpecsRow,
            });
            setminiError('Вы в конце списка');
          } else if (error === 'Вы в начале списка') {
            setRelativePosition({
              ...relativePosition,
              first: specsInfo as ProvperSpecsRow,
            });
            setminiError('Вы в начале списка');
          } else if (error.includes('reason:')) {
            //ЕСЛИ СНИМОК, ТО ДОБАВИТЬ?
            Alert.alert(
              'Внимание!',
              error.replaceAll('reason:', '') + ' Хотите создать?',
              [
                {text: 'Отмена', style: 'cancel'},
                {
                  text: 'Создать',
                  onPress: () => addNewNakladnaya({NumNakl: NumNakl ?? ''}),
                },
              ],
            );
          } else if (error === 'Пусто' && (Cmd === 'first' || Cmd === 'last')) {
            if (mounted) setspecsInfo(null);
          } else {
            if (mounted) alertActions(err);
          }
        } else {
          if (mounted) alertActions(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    },
    [specsInfo, relativePosition, mounted, isFilter],
  );

  function getInfoWorkLet({Cmd, NumNakl}: NakladnayaSpeckInterface) {
    getInfo({Cmd, NumNakl, isFilter});
  }

  const getCurrNakladnaya = async (NumNakl: string, isSecondScreen = false) => {
    getInfo({Cmd: 'curr', NumNakl, isSecondScreen, isFilter});
  };

  async function addNewNakladnaya({NumNakl}: {NumNakl: string}) {
    getInfo({Cmd: 'create', NumNakl, isFilter});
  }

  //<--------------ФУНКЦИИ/-------------->
  //<--------------ЭФФЕКТЫ-------------->
  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    getInfoWorkLet({Cmd: 'first', isFilter});
  }, [isFilter]);

  useEffect(() => {
    if (barcode.data) {
      getCurrNakladnaya(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);
  //<--------------ЭФФЕКТЫ/-------------->
  return (
    <ScreenTemplate
      {...props}
      title={'Работа с накладной №' + props.route.params.NumProv}>
      {/* <Button
        title={'setbarcode'}
        onPress={() => {
          setBarcode({...barcode, data: '73662999'});
        }}
      /> */}
      {error.length > 0 ? (
        <ErrorAndUpdateComponent
          update={() => getInfo({Cmd: 'first', isFilter})}
        />
      ) : loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={26} color={MAIN_COLOR} />
        </View>
      ) : specsInfo ? (
        <>
          <View style={{flex: 1, padding: 16}}>
            <WhiteCardForInfo>
              <View style={{flexDirection: 'row'}}>
                <TitleAndDiscribe
                  title={'Номер накладной'}
                  discribe={specsInfo?.NumNakl}
                />
              </View>
              <TitleAndDiscribe title={'Статус'} discribe={specsInfo?.Stat} />

              <TitleAndDiscribe
                title={'Дата накладной'}
                discribe={specsInfo?.DtNakl}
              />
              <TitleAndDiscribe
                title={'Из подразделения'}
                discribe={specsInfo?.ShopFrom}
              />
            </WhiteCardForInfo>
            <View style={{height: 16}} />
            <WhiteCardForInfo>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Родитель
              </Text>
              <TitleAndDiscribe
                title={'Номер'}
                discribe={specsInfo?.MasterNum}
              />
              <TitleAndDiscribe
                title={'Тип'}
                discribe={specsInfo?.MasterType}
              />
            </WhiteCardForInfo>
            <View style={{height: 16}} />

            <MenuListComponent
              data={[
                {
                  title: 'Показать список товаров',
                  action: goToGoodsList,
                  needChevrone: true,
                },
              ]}
            />
            {miniError.length > 0 ? (
              <>
                <View style={{height: 16}} />
                <WhiteCardForInfo>
                  <Text style={{color: 'red'}}>{miniError}</Text>
                </WhiteCardForInfo>
              </>
            ) : null}
          </View>
        </>
      ) : (
        <EmptyFlexComponent text="Информации нет" />
      )}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {specsInfo ? (
          <TouchableOpacity
            onPress={() => getCurrNakladnaya(specsInfo?.NumNakl ?? '')}
            activeOpacity={0.7}
            style={{
              alignSelf: 'flex-end',
              padding: 16,
              margin: 16,
              backgroundColor: MAIN_COLOR,
              borderRadius: 32,
              width: 100,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Feather name="rotate-ccw" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={switchFilter}
          activeOpacity={0.7}
          style={{
            alignSelf: 'flex-end',
            padding: 16,
            margin: 16,
            backgroundColor: MAIN_COLOR,
            borderRadius: 32,
            width: 100,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Фильтр</Text>
          <Feather
            name="check"
            size={20}
            color="white"
            style={{opacity: isFilter === 'true' ? 1 : 0}}
          />
        </TouchableOpacity>
      </View>
      <BottomActionBar
        {...props}
        isFilter={isFilter}
        getInfoWorkLet={getInfoWorkLet}
        createOrNavNakl={getCurrNakladnaya}
        relativePosition={relativePosition}
        specsInfo={specsInfo}
      />
    </ScreenTemplate>
  );
});

export default WorkWithNakladnaya;

const styles = StyleSheet.create({});
