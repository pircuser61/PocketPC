import {observer} from 'mobx-react-lite';
import React, {RefObject} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardTypeOptions,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR, TOGGLE_SCANNING} from '../../constants/funcrions';

interface InputFieldProps {
  title?: string | undefined;
  placeholder?: string;
  value?: string;
  loading?: boolean;
  autofocus?: boolean;
  setValue?: (txt: string) => void;
  onSubmit?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  onChangeText?: () => void;
  keyBoardType?: KeyboardTypeOptions | undefined;
  innerRef?: React.RefObject<TextInput | undefined>;
}

const ScanInput = observer(
  ({
    value = '',
    title,
    setValue = txt => {},
    onSubmit = () => {},
    onChangeText = () => {},
    loading = false,
    autofocus = false,
    placeholder = '',
    innerRef,
    keyBoardType = 'numeric',
  }: InputFieldProps) => {
    return (
      <>
        {title ? (
          <Text style={{fontWeight: 'bold', paddingTop: 10}}>{title}</Text>
        ) : null}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 4,
            borderWidth: 1,
            justifyContent: 'center',
            height: 48,
            marginVertical: 8,
          }}>
          <TextInput
            autoFocus={autofocus}
            ref={innerRef as RefObject<TextInput>}
            multiline={false}
            style={{paddingLeft: 16, paddingRight: 70, fontSize: 18}}
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              width: 60,
              height: 48,
            }}
            onPress={TOGGLE_SCANNING}>
            {loading ? (
              <ActivityIndicator color={MAIN_COLOR} />
            ) : (
              <MaterialCommunityIcons name={'barcode-scan'} size={24} />
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  },
);

export default ScanInput;
