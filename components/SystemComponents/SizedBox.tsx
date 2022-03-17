import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

const SizedBox = ({
  h,
  w,
  children,
  style,
}: {
  h?: number | string;
  w?: number | string;
  children?: any;
  style?: StyleProp<ViewStyle>;
}) => {
  return <View style={[{height: h, width: w}, style]}>{children}</View>;
};

export default SizedBox;

const styles = StyleSheet.create({});
