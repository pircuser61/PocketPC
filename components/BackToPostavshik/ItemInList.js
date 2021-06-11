import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const ItemInList = observer(props => {
  const {data, navigation, disabled = false} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('BackToPostItem', {
          data,
        });
      }}
      disabled={disabled}
      style={{
        height: 60,
        justifyContent: 'center',
        borderBottomWidth: 0.3,
        borderBottomColor: 'grey',
      }}>
      <View
        style={{
          marginHorizontal: 16,
          flexDirection: 'row',
          //backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={[styles.font, {width: 40, textAlign: 'left'}]}>
          {data.id}
        </Text>
        <Text style={[styles.font, {width: 80, textAlign: 'center'}]}>
          {data.$.CodGood}
        </Text>
        <Text style={[styles.font, {width: 40, textAlign: 'center'}]}>
          {data.$.MarkQty}
        </Text>
        <Text style={[styles.font, {width: 40, textAlign: 'center'}]}>
          {data.$.WoMarkQty}
        </Text>
        <Text style={[styles.font, {width: 50, textAlign: 'right'}]}>
          {data.$.GoodQty}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ItemInList;

const styles = StyleSheet.create({
  font: {
    fontWeight: 'bold',
  },
});
