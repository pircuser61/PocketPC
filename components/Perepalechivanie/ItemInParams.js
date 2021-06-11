import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {Divider} from 'react-native-paper';
import MaterialCom from 'react-native-vector-icons/MaterialCommunityIcons';

const ItemInParams = observer(
  ({
    right = '',
    left = '',
    needIcon = false,
    onIconPress = () => {},
    loading = false,
  }) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingRight: needIcon ? 40 : 0,
          }}>
          <Text style={styles.leftText}>{left}</Text>
          <Text
            style={[
              styles.rightText,
              {
                color:
                  right === 'Сканируйте код товара' ||
                  right === 'Сканируйте баркод'
                    ? 'black'
                    : 'black',
              },
            ]}>
            {right ? right : '---'}
          </Text>
          {needIcon ? (
            loading ? (
              <ActivityIndicator style={{position: 'absolute', right: 0}} />
            ) : (
              <TouchableOpacity
                onPress={onIconPress}
                style={{padding: 4, position: 'absolute', right: 0}}>
                <MaterialCom name={'close'} size={20} />
              </TouchableOpacity>
            )
          ) : null}
        </View>
        <Divider />
      </View>
    );
  },
);

export default ItemInParams;
const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
  textInputField: {
    justifyContent: 'center',
  },
  palletInputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
  rightText: {width: 180, textAlign: 'right', fontSize: 16},
  leftText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
