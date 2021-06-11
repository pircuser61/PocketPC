import {useFocusEffect} from '@react-navigation/core';
import React, {FC, useEffect, useCallback, useState} from 'react';
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
} from 'react-native';
import md5 from 'md5';
import {connect} from 'react-redux';
import {setHeaderOptionsThunk, setUserThunk} from '../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {gesAuth} from '../functions/gesAuth';
import {getCity} from '../functions/getCity';
import DeviceInfo from 'react-native-device-info';

const LoginScreen = ({setUserThunk}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [error, setError] = useState('');
  const [city, setCity] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    updateAll();
  }, []);

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

  let checkInputData = () => {
    try {
      setError('');
      Keyboard.dismiss();

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
          setUserThunk({...r, deviceName});
          setDeviceNameToAsync();
        })
        .catch(e => {
          setError(e);
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err.toString().replace('Error:', ''));
    }
  };

  let secondTextInput, thirdTextInput;
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      style={styles.container}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.form}>
            <Image
              source={require('../assets/logo.png')}
              style={{
                height: 80,
                width: 120,
                alignSelf: 'center',
              }}
            />

            <View style={{marginBottom: 20}}>
              {city ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    placeholder={'Город'}
                    style={[styles.input, {width: '90%', paddingLeft: 16}]}
                    autoCapitalize="none"
                    value={city ? city.value['city.name'] : ''}
                    blurOnSubmit={false}
                    keyboardType="visible-password"
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={clearCityField}
                    style={{marginLeft: 6}}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color="#313C47"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <DropDownPicker
                  labelStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  zIndex={200}
                  placeholder={
                    cityList.length
                      ? 'Выберите город'
                      : 'Идет загрузка городов...'
                  }
                  items={cityList.map(r => {
                    return {
                      label: r['city.name'],
                      value: r,
                    };
                  })}
                  containerStyle={{height: 40}}
                  style={{backgroundColor: '#f2f2f2'}}
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
            <View>
              <TextInput
                placeholder={'Логин'}
                style={styles.input}
                autoCapitalize="none"
                onChangeText={login => setLogin(login)}
                value={login}
                onSubmitEditing={() => {
                  secondTextInput.focus();
                }}
                blurOnSubmit={false}
                keyboardType="visible-password"
              />
            </View>
            <View style={{marginTop: 20}}>
              <TextInput
                placeholder={'Пароль'}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => setPassword(password)}
                value={password}
                ref={input => {
                  secondTextInput = input;
                }}
                onSubmitEditing={() => {
                  thirdTextInput.focus();
                }}
                scrollEnabled={false}
              />
            </View>
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
                  thirdTextInput = input;
                }}
                onSubmitEditing={checkInputData}
                keyboardType="visible-password"
              />
              <TouchableOpacity onPress={updateAll} style={{marginLeft: 6}}>
                <MaterialCommunityIcons
                  name="reload"
                  size={24}
                  color="#313C47"
                />
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator
                style={{alignSelf: 'center'}}
                color={'#313C47'}
              />
            ) : (
              <TouchableOpacity
                disabled={loading}
                style={styles.button}
                onPress={() => {
                  checkInputData();
                }}>
                <Text style={styles.buttonFont}>ВОЙТИ</Text>
              </TouchableOpacity>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </KeyboardAvoidingView>
        <Text style={{alignSelf: 'center'}}>
          Версия: {DeviceInfo.getVersion()}
        </Text>
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
    backgroundColor: '#313C47',
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
  },
});

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, {setUserThunk})(LoginScreen);
