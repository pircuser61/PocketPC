import {placeholder} from '@babel/types';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BRIGHT_GREY, MAIN_COLOR} from '../../constants/funcrions';

const WhiteTextInputWithButtonIcon = ({
  placeholder = '...',
  keyboardType = 'visible-password',
  iconName = 'close',
  startText = '',
  value,
  blurOnSubmit = true,
  setValue,
  onChangeText,
  onSubmitEditing,
  editable = true,
  onIconPress,
  loading = false,
  innerRef,
  autoFocus = false,
  secureTextEntry = false,
}: {
  placeholder?: string;
  value?: string;
  iconName?: string;
  needSecure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  setValue?: (text: string) => void;
  onIconPress?: () => void;
  loading?: boolean;
  startText?: string;
  innerRef?: any;
  autoFocus?: boolean;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
} & TextInputProps) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 8,
        flexDirection: 'row',
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}>
      {startText.length > 0 && (
        <Text style={{color: BRIGHT_GREY, paddingRight: 8, width: '25%'}}>
          {startText}
        </Text>
      )}
      <TextInput
        caretHidden={false}
        editable={editable}
        blurOnSubmit={blurOnSubmit}
        ref={innerRef}
        autoFocus={autoFocus}
        value={value}
        onSubmitEditing={onSubmitEditing}
        onChangeText={txt => {
          if (onChangeText) onChangeText(txt);
          if (setValue) setValue(txt);
        }}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        scrollEnabled={false}
        autoCapitalize="none"
        style={{
          flex: 1,
          height: 48,
          paddingRight: 16,
          fontSize: 14,
          color: 'black',
        }}
      />
      <TouchableOpacity
        onPress={onIconPress}
        disabled={loading}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        {loading ? (
          <ActivityIndicator size={16} color={MAIN_COLOR} />
        ) : (
          <MaterialCommunityIcons size={22} name={iconName} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default WhiteTextInputWithButtonIcon;

const styles = StyleSheet.create({});
