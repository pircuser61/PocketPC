import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderPriemka from '../components/PriemkaNaSklade/Header';
import MenuItem from '../components/PriemkaNaSklade/MenuItem';

/**
 * Проверка палетт PocketProvList(0)
        Проверка планограммы PocketProvList(1)
        Проверка выкладки PocketProvList(2)
        Проверка Актов Брака PocketProvList(3) 
 */

const menuItems = [
  {
    title: 'Проверка палетт',
    id: '1',
    ready: true,
    navName: 'CheckMenu',
    type: '0',
  },
  {
    title: 'Проверка планограммы',
    id: '2',
    ready: true,
    navName: 'CheckMenu',
    type: '1',
  },
  {
    title: 'Проверка выкладки',
    id: '3',
    ready: true,
    navName: 'm-prog7',
    type: '2',
  },
  {
    title: 'Проверка Актов Брака',
    id: '4',
    ready: true,
    navName: 'CheckMenu',
    type: '3',
  },
  {
    title: 'Проверка накладных',
    id: '5',
    ready: true,
    navName: 'm-prog14',
    type: '0',
  },
];

const Inventarization = (props: any) => {
  const renderItem = ({item}: {item: any}) => (
    <MenuItem
      {...props}
      item={item}
      params={{title: item.title, Type: item.type}}
      underText="Инвентаризация"
    />
  );
  const [render, startRender] = useState(false);

  useEffect(() => {
    setTimeout(() => startRender(true), 0);
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'Инвентаризация'} />

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

export default Inventarization;
