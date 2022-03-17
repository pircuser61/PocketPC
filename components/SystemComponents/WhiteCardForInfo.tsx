import React, {ReactChildren} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

const WhiteCardForInfo = ({
  children,
  style,
}: {
  children?: any;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[{padding: 8, backgroundColor: 'white', borderRadius: 8}, style]}>
      {children}
    </View>
  );
};

export default WhiteCardForInfo;

const styles = StyleSheet.create({});
