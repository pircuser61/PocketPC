import {observer} from 'mobx-react-lite';
import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InputField = observer(
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
        <Text style={{marginBottom: 8}}>{title}:</Text>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderWidth: isTextInput ? 1 : 0,
            justifyContent: 'center',
            height: 60,
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
                marginRight: 40,
              }}>
              {value ? value : 'Сканируйте номер паллеты'}
            </Text>
          )}
          <TouchableOpacity
            style={{position: 'absolute', right: 8}}
            onPress={onIconPress}
            disabled={iconName ? false : true}>
            {iconName ? (
              loading ? (
                <ActivityIndicator color={'#313C47'} />
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

export default InputField;

const styles = StyleSheet.create({
  countainer: {
    flex: 1,
  },
  textInputField: {
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 16,
    marginRight: 70,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
  palletInputStyle: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#D1D1D1',
    paddingLeft: 16,
    borderRadius: 4,
  },
});
