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
  {
    title: 'Инвентаризация',
    id: '1',
    ready: true,
    navName: 'CheckMenu',
    type: '4',
  },
  {
    title: 'Список из палетт',
    id: '2',
    ready: true,
    navName: 'CheckMenu',
    type: '7',
  },
];

const MenuPriemki = (props: any) => {
  const renderItem = ({item}: {item: any}) => (
    <MenuItem
      {...props}
      item={item}
      params={{title: item.title, Type: item.type}}
    />
  );
  const [render, startRender] = useState(false);

  useEffect(() => {
    setTimeout(() => startRender(true), 0);
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} />

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
