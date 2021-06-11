import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Divider} from 'react-native-paper';
import PerepalechivanieStore from '../../mobx/PerepalechivanieStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  IS_DEV,
  TOGGLE_SCANNING,
  TURN_ON_SCANNER,
} from '../../constants/funcrions';

const SelectPalletsForShops = observer(
  ({
    $ = {CodShop: '', NameMax: '', NumMax: '', order: ''},
    palletNumber = '',
    index = '',
    onPress = () => {},
    chosenId = null,
    onLongPress = () => {},
  }) => {
    return (
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={() => {
          onPress();
          TURN_ON_SCANNER();
        }}
        style={{
          backgroundColor: chosenId === index ? 'grey' : null,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 16,
            //backgroundColor: String(chosenId) === String(index) ? 'grey' : null,
          }}>
          <Text style={{fontSize: 14}}>Паллет - {$.NameMax}</Text>
          <Text style={{fontSize: 14}}>{$.CodShop}</Text>
          {IS_DEV ? (
            <TextInput
              style={[styles.palletInputStyle, {width: 150}]}
              keyboardType="numeric"
              value={PerepalechivanieStore.palletsList[index].palletNumber}
              onChangeText={text =>
                (PerepalechivanieStore.palletsList[index].palletNumber = text)
              }
              //value={value}
            />
          ) : (
            <Text>
              {PerepalechivanieStore.palletsList[index].palletNumber
                ? PerepalechivanieStore.palletsList[index].palletNumber
                : 'Сканируйте номер паллеты'}
            </Text>
          )}
        </View>

        <Divider />
      </TouchableOpacity>
    );
  },
);

export default SelectPalletsForShops;

const styles = StyleSheet.create({
  palletInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
});
