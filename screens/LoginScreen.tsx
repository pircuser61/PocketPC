import {useFocusEffect} from '@react-navigation/core';
import React, {FC, useEffect, useCallback, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  Vibration,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
//@ts-ignore
import md5 from 'md5';
//@ts-ignore
import IntentLauncher from 'react-native-intent-launcher';
//@ts-ignore
import {connect} from 'react-redux';

import {setUserThunk} from '../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {gesAuth} from '../functions/gesAuth';
import {getCity} from '../functions/getCity';
import DeviceInfo from 'react-native-device-info';
import ShopStore from '../mobx/ShopStore';
import PriemMestnyhHook from '../customHooks/PriemMestnyhHook';
import {IS_DEV, MAIN_COLOR, timeout} from '../constants/funcrions';
import UserStore from '../mobx/UserStore';
import {uri} from '../connectInfo';
import WhiteTextInputWithButtonIcon from '../components/SystemComponents/WhiteTextInput';
import SizedBox from '../components/SystemComponents/SizedBox';

const LoginScreen = (props: any) => {
  const {setUserThunk} = props;
  const [login, setLogin] = useState<string>(IS_DEV ? 'i-33' : '');
  const [password, setPassword] = useState<string>(IS_DEV ? '' : '');
  const [deviceName, setDeviceName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [city, setCity] = useState<any>(null);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  let mounted = false;

  const updateAll = () => {
    setError('');
    getDeviceName();
    getCityFromAsync();
    getCity()
      .then(r => setCityList(r['cityList']))
      .catch(e => {
        Vibration.vibrate(600);
        setError(e);
      });
  };

  const clearCityField = () => {
    AsyncStorage.removeItem('city')
      .then()
      .catch(e => console.log(e));
    setCity(null);
  };

  const startScreen = async () => {
    try {
      updateAll();
      const url = 'https://appstore.maxidom.ru/apps.json';
      console.log(url);
      let response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        let json = await response.json();
        if (Array.isArray(json.apps)) {
          json.apps.map((r: any) => {
            if (r.displayName == 'PocketPC') {
              console.log('Класс');
              if (r.version > DeviceInfo.getVersion()) {
                Vibration.vibrate(500);
                Alert.alert(
                  `Вышла новая версия (${r.version}) !`,
                  'Обновите приложение в лаунчере',
                  [
                    {
                      text: 'Отмена',
                      onPress: () => {},
                    },
                    {
                      text: 'Обновить',
                      onPress: async () => {
                        try {
                          IntentLauncher.startAppByPackageName(
                            'com.mlauncher',
                          ).catch((error: any) =>
                            Alert.alert(
                              'Проблема открытия лаунчера!',
                              'Откройте вручную...',
                            ),
                          );
                        } catch (e) {
                          console.log(e);
                        }
                      },
                    },
                  ],
                );
              } else if (
                r.version < DeviceInfo.getVersion() &&
                r.needback === 'true'
              ) {
                Vibration.vibrate(500);
                Alert.alert(
                  `Сейчас актуальна версия ниже (${r.version}) !`,
                  'Обновите приложение в лаунчере',
                  [
                    {
                      text: 'Отмена',
                      onPress: () => {},
                    },
                    {
                      text: 'Обновить',
                      onPress: async () => {
                        try {
                          IntentLauncher.startAppByPackageName(
                            'com.mlauncher',
                          ).catch((error: any) =>
                            Alert.alert(
                              'Проблема открытия лаунчера!',
                              'Откройте вручную...',
                            ),
                          );
                        } catch (e) {
                          console.log(e);
                        }
                      },
                    },
                  ],
                );
              }
            }
          });
        }
      }
    } catch (e) {
      if (mounted)
        Alert.alert(
          'Внимание!',
          'Не удалось проверить последнюю версию. Возможно, эта версия устарела!',
        );
      if (e instanceof TypeError) console.log(e);
      else console.log(e);
    }
  };

  const enterbyPass = async (pass: string) => {
    setPassword(pass);
    setLoading(true);
    checkInputData({login: login, password: pass});
  };

  useEffect(() => {
    startScreen();
  }, []);

  const _api = PriemMestnyhHook();

  const {barcode, setBarcode} = _api;
  //{data:'',time:'',type:''}

  useEffect(() => {
    if (barcode.data) {
      if (barcode.data === 'ChangeCompany') {
        ShopStore.deleteShop();
      } else if (barcode.data === 'SHOWMECURRENTURL') {
        Alert.alert('ССЫЛКА', uri);
      } else {
        if (login.length === 0) {
          setLogin(barcode.data);
        } else if (password.length === 0) {
          enterbyPass(barcode.data);
        }
      }

      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  const setDeviceNameToAsync = () => {
    Keyboard.dismiss();
    AsyncStorage.setItem('deviceName', deviceName);
    AsyncStorage.setItem('city', JSON.stringify(city));
  };

  const getDeviceName = () => {
    //Keyboard.dismiss()
    AsyncStorage.getItem('deviceName')
      .then(r => (r ? setDeviceName(r) : console.log('Имя девайса не задано')))
      .catch(e => console.log(e));
  };

  const getCityFromAsync = () => {
    //Keyboard.dismiss()
    AsyncStorage.getItem('city')
      .then(r => (r ? setCity(JSON.parse(r)) : console.log('Город не выбран')))
      .catch(e => console.log(e));
  };

  let checkInputData = ({
    password,
    login,
  }: {
    password: string;
    login: string;
  }) => {
    try {
      setError('');
      Keyboard.dismiss();

      if (
        !IS_DEV &&
        uri !== 'http://ges-web-cr.dc1.maxidom.ru:8080' &&
        uri !== 'http://gesweb.m0.maxidom.ru:8080'
      )
        throw new Error('Приложение не определило базу');

      if (!login) {
        throw new Error('Поле логина пустое');
      }
      if (!password) {
        throw new Error('Поле пароля пустое');
      }
      if (!city) {
        throw new Error('Выберете город');
      }
      if (!deviceName) {
        throw new Error('Введите или обновите имя устройства');
      }
      setLoading(true);
      gesAuth(login, md5(password), city['value']['city.cod'], deviceName)
        .then(async r => {
          //console.log(JSON.stringify(r.user.TokenData[0].$.UserUID));
          //console.log(JSON.stringify(UserStore.user));
          mounted = false;
          setUserThunk({...r, deviceName});
          UserStore.user = UserStore.user = {
            ...r.user.TokenData[0].$,
            ...r.user.$,
            deviceName,
          };
          setDeviceNameToAsync();
        })
        .catch(e => {
          if (typeof e === 'string') {
            setError(e);
          } else setError(JSON.stringify(e));
          setLoading(false);
        });
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(err + '');
      }
      setLoading(false);
    }
  };

  const src = '../assets/logo.png';

  const secondTextInput = useRef<TextInput>(null);
  const thirdTextInput = useRef<TextInput>(null);

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      style={styles.container}>
      <View style={styles.container}>
        {IS_DEV && (
          <TouchableOpacity
            onPress={ShopStore.deleteShop}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              alignSelf: 'center',
            }}>
            <MaterialCommunityIcons name={'map-marker-left'} size={24} />
          </TouchableOpacity>
        )}
        {IS_DEV && (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SandBox')}
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              alignSelf: 'center',
            }}>
            <MaterialCommunityIcons name={'pentagon-outline'} size={24} />
          </TouchableOpacity>
        )}
        <KeyboardAvoidingView behavior="position">
          <View style={styles.form}>
            <View
              style={{
                width: '100%',
                //backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                //marginVertical: 10,
              }}>
              <TouchableOpacity
                onLongPress={() => {
                  props.navigation.navigate('GetBarcodeInfoScreen');
                }}>
                <ShopStore.LogImage />
              </TouchableOpacity>
            </View>
            <View>
              {city ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <WhiteTextInputWithButtonIcon
                    editable={false}
                    placeholder={'Город'}
                    autoCapitalize="none"
                    value={city ? city.value['city.name'] : ''}
                    blurOnSubmit={false}
                    keyboardType="visible-password"
                    onIconPress={clearCityField}
                  />
                </View>
              ) : (
                <DropDownPicker
                  labelStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                    paddingHorizontal: 4,
                  }}
                  zIndex={200}
                  placeholder={
                    cityList.length
                      ? 'Выберите город'
                      : error.length
                      ? 'Ошибка! Города не загружены...'
                      : 'Идет загрузка городов...'
                  }
                  items={cityList.map(r => {
                    return {
                      label: r['city.name'],
                      value: r,
                    };
                  })}
                  containerStyle={{height: 48}}
                  style={{backgroundColor: 'white'}}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={item => {
                    // console.log(item);
                    setCity(item);
                  }}
                />
              )}
            </View>

            <SizedBox h={8} />
            <WhiteTextInputWithButtonIcon
              blurOnSubmit={false}
              value={login}
              setValue={setLogin}
              placeholder="Табельный номер"
              keyboardType="default"
              onSubmitEditing={() => secondTextInput.current?.focus()}
              onIconPress={() => {
                setLogin('');
              }}
            />
            <SizedBox h={8} />
            <WhiteTextInputWithButtonIcon
              blurOnSubmit={false}
              secureTextEntry={true}
              value={password}
              innerRef={secondTextInput}
              setValue={setPassword}
              placeholder="Пароль"
              needSecure={true}
              keyboardType="default"
              onSubmitEditing={() => thirdTextInput.current?.focus()}
              onIconPress={() => {
                setPassword('');
              }}
            />
            <SizedBox h={8} />

            <WhiteTextInputWithButtonIcon
              value={deviceName}
              innerRef={thirdTextInput}
              setValue={setDeviceName}
              placeholder="Имя устройства"
              keyboardType="visible-password"
              onIconPress={updateAll}
              iconName="update"
              onSubmitEditing={() =>
                checkInputData({password: password, login: login})
              }
            />
            <SizedBox h={20} />

            {loading ? (
              <ActivityIndicator
                style={{alignSelf: 'center'}}
                color={MAIN_COLOR}
              />
            ) : (
              <TouchableOpacity
                disabled={loading}
                style={styles.button}
                onPress={() => {
                  checkInputData({login: login, password: password});
                }}>
                <Text style={styles.buttonFont}>ВОЙТИ</Text>
              </TouchableOpacity>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </KeyboardAvoidingView>
        <View style={{flex: 1}}></View>
        <View style={{margin: 16}}>
          <Text
            style={{
              alignSelf: 'center',
              color: 'grey',
              fontSize: 10,
            }}>
            Версия: {DeviceInfo.getVersion()}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: 'grey',
              fontSize: 10,
            }}>
            {'<' +
              (ShopStore.shopName === 'maxidom'
                ? 'Максидом'
                : ShopStore.shopName === 'castorama'
                ? 'Castorama'
                : '') +
              ' 2021/>'}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  greeting: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  form: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  inputTitle: {
    color: 'black',
    fontSize: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderColor: '#e6e6e6',
    borderWidth: 1,
    height: 40,
    fontSize: 14,
    color: 'black',
    paddingLeft: 20,
    //paddingVertical:6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  button: {
    marginHorizontal: 0,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
  },
  buttonFont: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  error: {
    alignSelf: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {};
};

export default connect(mapStateToProps, {setUserThunk})(LoginScreen);

/**
<View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder={'Табельный номер'}
                style={[styles.input, {width: '90%'}]}
                autoCapitalize="none"
                onChangeText={login => setLogin(login)}
                value={login}
                onSubmitEditing={() => {
                  secondTextInput.current?.focus();
                }}
                blurOnSubmit={false}
                keyboardType="visible-password"
              />
              <TouchableOpacity
                onPress={() => {
                  setLogin('');
                }}
                style={{marginLeft: 6}}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={MAIN_COLOR}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder={'Пароль'}
                style={[styles.input, {width: '90%'}]}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => setPassword(password)}
                value={password}
                ref={secondTextInput}
                onSubmitEditing={() => {
                  thirdTextInput?.current?.focus();
                }}
                scrollEnabled={false}
              />
              <TouchableOpacity
                onPress={() => {
                  setPassword('');
                }}
                style={{marginLeft: 6}}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={MAIN_COLOR}
                />
              </TouchableOpacity>
            </View> 
            
            //
             <View
              style={{
                marginTop: 20,
                marginBottom: 20,
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder={'Имя устройства'}
                style={[styles.input, {width: '90%'}]}
                autoCapitalize="none"
                onChangeText={devicename => setDeviceName(devicename)}
                value={deviceName}
                ref={input => {
                  // = input;
                }}
                onSubmitEditing={() =>
                  checkInputData({password: password, login: login})
                }
                keyboardType="visible-password"
              />
              <TouchableOpacity onPress={updateAll} style={{marginLeft: 6}}>
                <MaterialCommunityIcons
                  name="reload"
                  size={24}
                  color={MAIN_COLOR}
                />
              </TouchableOpacity>
            </View>
            */
