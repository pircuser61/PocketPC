import {observer} from 'mobx-react-lite';
import React, {RefObject} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardTypeOptions,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR} from '../../constants/funcrions';

interface InputFieldProps {
  title?: string;
  padding?: number;
  iconName?: string;
  titleColor?: string;
  placeholder?: string;
  notiplaceholder?: string;
  titleval?: string;
  value?: string;
  suggesionText?: string;
  loading?: boolean;
  autofocus?: boolean;
  needIcon?: boolean;
  isTextInput?: boolean;
  needTitle?: boolean;
  needSuggesion?: boolean;
  onIconPress?: () => void;
  setValue?: (txt: string) => void;
  onSubmit?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  onChangeText?: () => void;
  suggesionAction?: () => void;
  keyBoardType?: KeyboardTypeOptions | undefined;
  innerRef?: React.RefObject<TextInput | undefined>;
}

const InputField = observer(
  ({
    title = '',
    needTitle = true,
    iconName = '',
    onIconPress = () => {},
    value = '',
    setValue = txt => {},
    onSubmit = () => {},
    onChangeText = () => {},
    loading = false,
    isTextInput = false,
    autofocus = false,
    placeholder = '',
    notiplaceholder = '',
    needSuggesion = false,
    suggesionText = '',
    needIcon = true,
    suggesionAction = () => {},
    innerRef,
    titleval = '',
    padding = 16,
    titleColor = 'black',
    keyBoardType = 'numeric',
  }: InputFieldProps) => {
    return (
      <View style={{padding}}>
        {needTitle && (
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{marginBottom: 8, color: titleColor, fontWeight: 'bold'}}>
              {title}:{' '}
            </Text>
            <Text style={{marginBottom: 8, color: titleColor}}>{titleval}</Text>
          </View>
        )}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderWidth: isTextInput ? 1 : 0,
            justifyContent: 'center',
            height: 60,
            marginVertical: 8,
          }}>
          {isTextInput ? (
            <TextInput
              autoFocus={autofocus}
              ref={innerRef as RefObject<TextInput>}
              multiline={false}
              style={{paddingLeft: 16, paddingRight: needIcon ? 70 : 16}}
              keyboardType={keyBoardType}
              value={value}
              placeholder={
                placeholder ? placeholder : 'Введите или сканируйте номер'
              }
              onChangeText={text => {
                setValue(text);
                onChangeText();
              }}
              onSubmitEditing={event => onSubmit(event)}
            />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'left',
                color: 'grey',

                marginLeft: 16,
                marginRight: 70,
              }}>
              {value ? value : notiplaceholder}
            </Text>
          )}
          {needIcon && (
            <TouchableOpacity
              style={{
                position: 'absolute',

                justifyContent: 'center',
                alignItems: 'center',
                right: 0,
                width: 60,
                height: 60,
              }}
              onPress={onIconPress}
              disabled={iconName ? false : true}>
              {iconName ? (
                loading ? (
                  <ActivityIndicator color={MAIN_COLOR} />
                ) : (
                  <MaterialCommunityIcons name={iconName} size={24} />
                )
              ) : null}
            </TouchableOpacity>
          )}
        </View>
        {needSuggesion ? (
          <TouchableOpacity style={{marginTop: 4}} onPress={suggesionAction}>
            <Text style={{color: MAIN_COLOR, textDecorationLine: 'underline'}}>
              {suggesionText}
            </Text>
          </TouchableOpacity>
        ) : null}
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
