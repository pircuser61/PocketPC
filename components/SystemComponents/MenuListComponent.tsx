import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {BRIGHT_GREY, MAIN_COLOR} from '../../constants/funcrions';
import {MenuActionProps} from '../../types/types';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MenuListComponent = ({data = []}: {data: MenuActionProps[]}) => {
  return (
    <View
      style={{
        borderRadius: 8,
        borderWidth: 0.4,
        backgroundColor: MAIN_COLOR,
        width: '100%',
        alignSelf: 'center',
      }}>
      {data.map((r, i) => (
        <TouchableOpacity
          disabled={(r.disabled ? r.disabled : false) || r.loading}
          onPress={r.action}
          key={i}
          style={{
            padding: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            borderTopWidth: i === 0 ? 0 : 0.4,
            borderColor: BRIGHT_GREY,
          }}>
          <ActivityIndicator
            size={20}
            color={BRIGHT_GREY}
            style={{opacity: r.loading ? 1 : 0}}
          />
          <Text style={{color: 'white', fontWeight: 'bold'}}>{r.title}</Text>

          {r.needChevrone && (
            <AntDesign name={'right'} color={'white'} size={18} />
          )}
          {r.readyMark && (
            <AntDesign name={'check'} color={'white'} size={18} />
          )}
          {r.close && <AntDesign name={'close'} color={'white'} size={18} />}
          {r.icon && <AntDesign name={r.icon} color={'white'} size={18} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuListComponent;

const styles = StyleSheet.create({});
