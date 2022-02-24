import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {MAIN_COLOR} from '../../constants/funcrions';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const BUTTON_SIZE = 65;

const AbsoluteButton = ({
  style,
  onPress,
  onPressIn,
  onPressOut,
  iconName,
}: {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  iconName: string;
  style: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={style}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <View
          style={{
            borderRadius: BUTTON_SIZE,
            backgroundColor: MAIN_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
            height: BUTTON_SIZE,
            width: BUTTON_SIZE,
          }}>
          <View style={{padding: 16}}>
            <MaterialIcon
              name={iconName}
              size={BUTTON_SIZE / 3}
              color={'white'}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AbsoluteButton;

const styles = StyleSheet.create({});
