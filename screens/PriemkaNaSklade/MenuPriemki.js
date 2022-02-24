import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-paper';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuItem from '../../components/PriemkaNaSklade/MenuItem';

const menuItems = [
  {title: 'Прием местных', id: '1', ready: true, navName: 'PriemMestnyhNav'},
  {
    title: 'Прием по штрих/бумаге',
    id: '2',
    ready: true,
    navName: 'PriemPoStrihBumageNav',
  },
  {
    title: 'Перепалечивание',
    id: '3',
    ready: true,
    navName: 'PerepalechivanieStackNav',
  },
  {title: 'Проверка перепалечивания', id: '4', ready: false},
  {
    title: 'Проверка палетт',
    id: '5',
    ready: true,
    navName: 'CheckPattlesNaSklade',
  },
  {title: 'Прием перед.накладных', id: '6', ready: false},
  {title: 'ТТН', id: '7', ready: false},
  {title: 'Проверка ВГХ', id: '8', ready: false},
  {
    title: 'Возвраты поставщику',
    id: '9',
    ready: true,
    navName: 'BackToPostavshikNav',
  },
  {
    id: '10',
    navName: 'CrossDockingNav',
    ready: true,
    title: 'Кросс-докинг',
  },
  // {
  //   title: 'Тестовый экран',
  //   id: '10',
  //   ready: true,
  //   navName: 'GetBarcodeInfoScreen',
  // },
].sort((a, b) => b.ready - a.ready || a.id - b.id);

const MenuPriemki = ({navigation}) => {
  const renderItem = ({item}) => (
    <MenuItem item={item} navigation={navigation} />
  );
  const [render, startRender] = useState(false);

  useEffect(() => {
    setTimeout(() => startRender(true), 0);
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka navigation={navigation} />

      {render ? (
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#313C47" />
        </View>
      )}
    </View>
  );
};

export default MenuPriemki;
