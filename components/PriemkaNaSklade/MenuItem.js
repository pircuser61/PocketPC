import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuItem = ({
  item,
  navigation,
  params = {},
  underText = 'Приемка на складе',
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navName, params)}
      disabled={!item.ready}
      style={{
        marginTop: 10,
        marginRight: 0,
        opacity: item.ready ? 1 : 0.2,
        marginLeft: 16,
      }}>
      <Text style={{fontSize: 20}}>{item.title}</Text>
      <Text
        style={{
          fontSize: 14,
          opacity: 0.6,
          fontWeight: '400',
          marginBottom: 10,
        }}>
        {underText}
      </Text>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="black"
        style={{position: 'absolute', right: 16, marginTop: 10}}
      />
      <Divider />
    </TouchableOpacity>
  );
};

export default MenuItem;
