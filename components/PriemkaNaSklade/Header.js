import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderPriemka = ({
  navigation,
  title,
  arrow,
  accept,
  onLeftPress = () => {
    navigation.goBack();
  },
  onPressCenter = () => {},
  needPressCenter = false,
}) => {
  const goHomeAlert = () =>
    Alert.alert(
      'Возврат на главный экран',
      'Вы хотите вернуться на главный экран?',
      [
        {
          text: 'Отмена',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Вернуться', onPress: () => navigation.navigate('123')},
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
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );

  return (
    <View
      style={{
        backgroundColor: '#313C47',
        justifyContent: 'center',
        height: 60,
      }}>
      <TouchableRipple
        style={{position: 'absolute', left: 0, opacity: 0.94, padding: 16}}
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

      <TouchableRipple
        style={{position: 'absolute', right: 0, opacity: 0.94, padding: 16}}
        onPress={() => {
          //
          goHomeAlert();
        }}
        rippleColor="rgba(0, 0, 0, .32)">
        <MaterialCommunityIcons name="home-outline" size={26} color="white" />
      </TouchableRipple>
    </View>
  );
};

export default HeaderPriemka;
