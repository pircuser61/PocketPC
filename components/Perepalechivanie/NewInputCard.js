import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR} from '../../constants/funcrions';

const NewInputCard = observer(
  ({
    title = '',
    iconName = '',
    onIconPress = () => {},
    value = '',
    setValue = () => {},
    onSubmit = () => {},
    onChangeText = () => {},
    loading = false,
    isTextInput = false,
    placeholder = '',
  }) => {
    return (
      <View style={{padding: 16}}>
        <Text>{title}</Text>
        <View
          style={{
            backgroundColor: '#D1D1D1',
            borderRadius: 4,
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          {isTextInput ? (
            <TextInput
              style={{paddingLeft: 16, paddingRight: 40}}
              keyboardType="numeric"
              value={value}
              placeholder={
                placeholder ? placeholder : 'Введите или сканируйте номер'
              }
              onChangeText={text => {
                setValue(text);
                onChangeText();
              }}
              onSubmitEditing={onSubmit}
            />
          ) : (
            <Text
              style={{
                textAlign: 'left',
                color: 'grey',
                marginLeft: 16,
                paddingLeft: 16,
                paddingRight: 40,
              }}>
              {value ? value : 'Сканируйте номер паллеты'}
            </Text>
          )}
          <TouchableOpacity
            style={{position: 'absolute', right: 8}}
            onPress={onIconPress}
            disabled={!iconName ? false : true}>
            {iconName ? (
              loading ? (
                <ActivityIndicator color={MAIN_COLOR} />
              ) : (
                <MaterialCommunityIcons name={iconName} size={24} />
              )
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export default NewInputCard;

const styles = StyleSheet.create({});
