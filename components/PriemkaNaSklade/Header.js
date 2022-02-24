import React from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BRIGHT_GREY, MAIN_COLOR} from '../../constants/funcrions';

const HeaderPriemka = ({
  navigation,
  title,
  needHome = true,
  needsearchBar = false,
  value = '',
  placeholder = 'Номер проверки или пользователя',
  onChangeText = () => {},
  onLeftPress = () => {
    navigation.goBack();
  },
  onPressCenter = () => {},
  needPressCenter = false,
  onClosePress = () => {},
}) => {
  const goHomeAlert = () =>
    Alert.alert(
      'Возврат на главный экран',
      'Вы хотите вернуться на главный экран?',
      [
        {
          text: 'Отмена',
          onPress: () => console.log('Нажали отмена'),
          style: 'cancel',
        },
        {text: 'Вернуться', onPress: () => navigation.navigate('HomeScreen')},
      ],
      {cancelable: false},
    );

  const goBackAlert = () =>
    Alert.alert(
      'Вы хотите вернуться назад?',
      'Вы потеряете текущий прогресс.',
      [
        {text: 'Вернуться', onPress: () => navigation.goBack()},
        {
          text: 'Отмена',
          onPress: () => console.log('Нажали отмена'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );

  return (
    <>
      <View
        style={{
          backgroundColor: MAIN_COLOR,
          justifyContent: 'center',
          height: 60,
        }}>
        <TouchableRipple
          style={{position: 'absolute', right: 0, opacity: 0.94, padding: 16}}
          onPress={onLeftPress}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
        </TouchableRipple>
        <TouchableOpacity
          onPress={onPressCenter}
          disabled={!needPressCenter}
          style={{
            marginHorizontal: 16,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center',

              letterSpacing: 0.15,
              color: 'white',
              opacity: 0.94,
              textAlign: 'center',
            }}>
            {title ? title : 'Приемка на складе'}
            {needPressCenter ? (
              <MaterialCommunityIcons name="chevron-down" />
            ) : null}
          </Text>
        </TouchableOpacity>

        {needHome ? (
          <TouchableRipple
            style={{position: 'absolute', left: 0, opacity: 0.94, padding: 16}}
            onPress={() => {
              //
              goHomeAlert();
            }}
            rippleColor="rgba(0, 0, 0, .32)">
            <MaterialCommunityIcons
              name="home-outline"
              size={26}
              color="white"
            />
          </TouchableRipple>
        ) : null}
      </View>
      {needsearchBar && (
        <View style={{backgroundColor: MAIN_COLOR}}>
          <View
            style={{
              backgroundColor: BRIGHT_GREY,
              marginHorizontal: 16,
              marginBottom: 8,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{
                width: '85%',
                height: 48,
                paddingLeft: 16,
              }}
              value={value}
              numberOfLines={1}
              onChangeText={onChangeText}
              keyboardType={'number-pad'}
              placeholder={placeholder}
            />
            <TouchableOpacity
              onPress={onClosePress}
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                width: 48,
              }}>
              <MaterialCommunityIcons name={'close'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default HeaderPriemka;

/**
 *  <View
          style={{
            backgroundColor: MAIN_COLOR,

            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 16,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: BRIGHT_GREY,
              marginVertical: 10,
              borderWidth: 1,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}>
            <TextInput
              value={value}
              numberOfLines={1}
              onChangeText={onChangeText}
              keyboardType={'number-pad'}
              placeholder={placeholder}
              style={{
                height: 48,
              }}
            />
            <TouchableOpacity
              onPress={onClosePress}
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons name={'close'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
 */
