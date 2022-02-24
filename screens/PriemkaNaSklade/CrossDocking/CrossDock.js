import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  FlatList,
  BackHandler,
} from 'react-native';
import InputField from '../../../components/Perepalechivanie/InputField';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {
  alertActions,
  MAIN_COLOR,
  TOGGLE_SCANNING,
} from '../../../constants/funcrions';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import {CrossDockPalett} from '../../../functions/CrossDockPalett';
import BigSquareInfo from '../../../components/RelocatePallets/BigSquareInfo';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import {CrossDockSpecs} from '../../../functions/CrossDockSpecs';
import {Divider} from 'react-native-paper';
import {CrossDockTasks} from '../../../functions/CrossDockTasks';
import ModalOfList from '../../../components/CrossDocking/ModalOfList';
import ChooseNumNaklList from '../../../components/CrossDocking/ChooseNumNaklList';
import LoadingModalComponent from '../../../components/SystemComponents/LoadingModalComponent';
import CrossDockCheckModal from '../../../components/CrossDocking/CrossDockCheckModal';
import {CrossDockCheck} from '../../../functions/CrossDockCheck';

const CrossDock = observer(({navigation, route, user}) => {
  const {typeofdock = ''} = route.params;
  const _api = PriemMestnyhHook();
  const typeOfCross = typeofdock == 'Приход' ? false : true;

  const {barcode, setBarcode} = _api;
  const [scanPallet, setscanPallet] = useState(false);
  const [scanBarcode, setscanBarcode] = useState(false);
  const [docNum, setdocNum] = useState('');
  const [palletNumber, setpalletNumber] = useState('');
  const [localBarcode, setlocalBarcode] = useState('');
  const [loading, setloading] = useState(false);
  const [specsList, setspecsList] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [naklList, setnaklList] = useState([]);
  const [modalChooseVisible, setmodalChooseVisible] = useState(false);
  const [crossdockcheckmodal, setcrossdockcheckmodal] = useState(false);

  const getListOfNakl = async () => {
    try {
      let answer = await CrossDockTasks(
        typeOfCross ? 'Out' : 'In',
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      );
      if (Array.isArray(answer)) {
        setnaklList(answer);
      } else setnaklList([answer]);
    } catch (error) {
      alertActions(error);
    }
  };

  const checkIsRashodReady = async () => {
    try {
      let result = await CrossDockCheck(
        docNum,
        'Out',
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  const pickPalletFromModal = (numpal = '') => {
    setpalletNumber(numpal);
    setscanBarcode(true);
    setcrossdockcheckmodal(false);
    setmodalVisible(false);
  };

  const docNumAction = () => {
    if (docNum.length > 0) {
      if (scanBarcode || scanPallet) {
        setscanPallet(false);
        setscanBarcode(false);
        setpalletNumber('');
        setlocalBarcode('');
        setdocNum('');
        setspecsList([]);
      } else {
        getInfoAboutPallets(docNum);
      }
    } else
      Alert.alert(
        'Внимание!',
        'Cначала введите или сканируйте номер заявки...',
      );
  };

  useEffect(() => {
    if (barcode.data) {
      if (!scanPallet && !scanBarcode) {
        setdocNum(barcode.data);
        getInfoAboutPallets(barcode.data);
        //setscanPallet(true);
      } else if (scanPallet && !scanBarcode) {
        setpalletNumber(barcode.data);
        setscanBarcode(true);
      } else if (scanPallet && scanBarcode) {
        if (barcode.data.split('').filter(r => r === '-').length >= 4)
          setlocalBarcode(barcode.data);
        else {
          alertActions('Баркод не подходит');
          setlocalBarcode('');
        }
      }
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    getListOfNakl();
  }, []);

  const obrabotkaPoley = () => {
    if (docNum.length == 0) {
      throw 'Поле номера заявки пустое!';
    }
    if (palletNumber.length == 0) {
      throw 'Поле номера паллеты пустое!';
    }
    if (localBarcode.length == 0) {
      throw 'Баркод не сканирован!';
    }
  };

  const opredStatus = () => {
    console.log('Нажал');
    if (!scanPallet && !scanBarcode) {
      if (docNum.length > 0) {
        setscanPallet(true);
      } else
        Alert.alert(
          'Внимание!',
          'Cначала введите или сканируйте номер заявки...',
        );
    }
    if (scanPallet && !scanBarcode) {
      if (palletNumber.length > 0) {
        setscanBarcode(true);
      } else
        Alert.alert(
          'Внимание!',
          'Cначала введите или сканируйте номер паллеты...',
        );
    }
    if (scanPallet && scanBarcode) {
      if (localBarcode.length > 0) {
        makeAction();
      } else Alert.alert('Внимание!', 'Cначала сканируйте номер баркод...');
    }
  };

  const getInfoAboutPallets = async data => {
    try {
      setloading(true);

      let answer = await CrossDockSpecs(
        data,
        typeOfCross,
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      );
      if (Array.isArray(answer)) {
        setspecsList(answer);
      } else setspecsList([answer]);
      setscanPallet(true);
    } catch (error) {
      alertActions(error);
    } finally {
      setloading(false);
    }
  };

  function openModal() {
    setmodalVisible(true);
  }

  makeAction = async () => {
    try {
      setloading(true);
      obrabotkaPoley();
      let answer = await CrossDockPalett(
        docNum,
        palletNumber,
        localBarcode,
        typeOfCross,
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      );
      if (answer === true) {
        Alert.alert('Успешно!', 'Упаковочный лист добавлен');

        setscanBarcode(false);
        setpalletNumber('');
        setlocalBarcode('');
        // setdocNum('');
        // setspecsList([]);
        getInfoAboutPallets(docNum);
      }
    } catch (error) {
      alertActions(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <View style={{flex: 1}}>
          <HeaderPriemka
            navigation={navigation}
            arrow={true}
            title={`Кросс-докинг (${typeOfCross ? 'расход' : 'приход'})`}
          />
          <InputField
            needSuggesion={naklList.length}
            suggesionText={'Показать список заданий'}
            suggesionAction={() => {
              setmodalChooseVisible(true);
            }}
            title={'Введите или сканируйте номер заявки на прием кросс-дока'}
            placeholder={'Номер заявки'}
            iconName={scanBarcode || scanPallet ? 'close' : 'arrow-right'}
            onIconPress={docNumAction}
            value={docNum}
            onSubmit={docNumAction}
            setValue={txt => {
              setdocNum(txt);
            }}
            onChangeText={() => {}}
            loading={false}
            isTextInput={!scanPallet}
          />

          {scanPallet && (
            <View
              from={{opacity: 0, rotateX: '45deg'}}
              animate={{opacity: 1, rotateX: '0deg'}}
              exit={{opacity: 0, rotateX: '45deg'}}
              transition={{type: 'timing'}}>
              <InputField
                title={'Введите или сканируйте номер паллеты'}
                placeholder={'Номер паллеты'}
                iconName={scanPallet && !scanBarcode ? 'arrow-right' : 'close'}
                onIconPress={() => {
                  if (scanPallet && !scanBarcode) {
                    if (palletNumber.length > 0) {
                      setscanBarcode(true);
                    } else
                      Alert.alert(
                        'Внимание!',
                        'Cначала введите или сканируйте номер паллеты...',
                      );
                  } else if (scanPallet && scanBarcode) {
                    setscanBarcode(false);
                    setlocalBarcode('');
                    setpalletNumber('');
                  }
                }}
                value={palletNumber}
                onSubmit={() => {
                  if (scanPallet && !scanBarcode) {
                    if (palletNumber.length > 0) {
                      setscanBarcode(true);
                    } else
                      Alert.alert(
                        'Внимание!',
                        'Cначала введите или сканируйте номер паллеты...',
                      );
                  } else if (scanPallet && scanBarcode) {
                    setscanBarcode(false);
                    setlocalBarcode('');
                    setpalletNumber('');
                  }
                }}
                setValue={txt => {
                  setpalletNumber(txt);
                }}
                onChangeText={() => {}}
                loading={false}
                isTextInput={scanPallet && !scanBarcode}
              />
            </View>
          )}

          {scanBarcode && (
            <View
              style={
                {
                  //alignSelf: 'center',
                  //justifyContent: 'center',
                  // alignItems: 'center',
                }
              }
              from={{opacity: 0, rotateX: '45deg'}}
              animate={{opacity: 1, rotateX: '0deg'}}
              exit={{opacity: 0, rotateX: '45deg'}}
              transition={{type: 'timing'}}>
              <InputField
                title={'Сканируйте баркод'}
                placeholder={'Баркод'}
                iconName={'barcode-scan'}
                onIconPress={TOGGLE_SCANNING}
                value={localBarcode}
                isTextInput={true}
                setValue={txt => setlocalBarcode(txt)}
              />
            </View>
          )}
          <LoadingModalComponent modalVisible={loading} />

          <View style={{flex: 1}} />
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <AbsoluteAnimButton
                show={true}
                iconName={'barcode-scan'}
                onPress={TOGGLE_SCANNING}
                style={{}}
              />

              {specsList.length > 0 && (
                <>
                  <View style={{width: 16}} />
                  <AbsoluteAnimButton
                    show={specsList.length > 0}
                    //show={true}
                    iconName={'format-list-bulleted'}
                    onPress={openModal}
                    style={{}}
                  />
                </>
              )}

              {scanPallet && typeOfCross && (
                <>
                  <View style={{width: 16}} />
                  <TouchableOpacity
                    onPress={() => {
                      setcrossdockcheckmodal(true);
                    }}
                    style={{
                      borderRadius: 50,
                      backgroundColor: MAIN_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 50,
                    }}>
                    <View style={{padding: 16}}>
                      <Text style={{color: 'white'}}>Проверить</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <AbsoluteAnimButton
              //show={true}
              show={
                !(localBarcode.length &&
                palletNumber.length &&
                docNum.length &&
                scanPallet &&
                scanBarcode &&
                !loading
                  ? false
                  : true)
              }
              onPress={makeAction}
              style={{}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <ModalOfList
        setmodalVisible={setmodalVisible}
        visible={modalVisible}
        list={specsList}
        onPressElement={pickPalletFromModal}
      />
      <ChooseNumNaklList
        visible={modalChooseVisible}
        setmodalVisible={setmodalChooseVisible}
        list={naklList}
        onPressPallete={number => {
          setscanPallet(false);
          setscanBarcode(false);
          setpalletNumber('');
          setlocalBarcode('');
          setspecsList([]);
          setmodalChooseVisible(false);
          setdocNum(number);
          getInfoAboutPallets(number);
        }}
        updateAction={getListOfNakl}
      />
      <CrossDockCheckModal
        onPressPallete={pickPalletFromModal}
        visible={crossdockcheckmodal}
        setmodalVisible={setcrossdockcheckmodal}
        list={[]}
        updateAction={checkIsRashodReady}
      />
    </>
  );
});

const AbsoluteAnimButton = ({
  style = {},
  iconName = 'check',
  show = false,
  onPress = () => {},
}) => {
  return (
    show && (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: MAIN_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 50,
            }}>
            <View style={{padding: 16}}>
              <MaterialIcon name={iconName} size={20} color={'white'} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  );
};

/**
 *  {specsList.map((r, i) => {
                const {NumPal = '', Order = '', SuplierPal = ''} = r;
                return (
                  <View key={i}>
                    <Text>{NumPal}</Text>
                    <Text>{Order}</Text>
                    <Text>{SuplierPal}</Text>
                  </View>
                );
              })}
 */

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps, {})(CrossDock);
