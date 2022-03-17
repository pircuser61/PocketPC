import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';

import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import MenuItem from '../../../components/PriemkaNaSklade/MenuItem';

const MenuCrossDock = observer(({navigation}) => {
  const renderItem = ({item}) => (
    <MenuItem
      item={item}
      navigation={navigation}
      params={{typeofdock: item.title}}
    />
  );

  const menuItems = [
    {title: 'Приход', id: '1', ready: true, navName: 'CrossDock'},
    {
      title: 'Расход',
      id: '2',
      ready: true,
      navName: 'CrossDock',
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <HeaderPriemka
          navigation={navigation}
          arrow={true}
          title={'Выберите тип'}
        />
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});

export default MenuCrossDock;
