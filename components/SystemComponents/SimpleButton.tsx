import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface SimpleButtonProps {
  onPress?: () => void;
  text: string;
  textStyle?: object;
  containerStyle?: object;
  active?: boolean;
}

const SimpleButton = (props: SimpleButtonProps) => {
  if (props.active === false) {
    return (
      <View style={[styles.SimpleButtonContainer, props.containerStyle]}>
        <Text
          style={[styles.simpleButtonText, props.textStyle, {color: 'gray'}]}>
          {props.text}
        </Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.SimpleButtonContainer, props.containerStyle]}>
      <Text style={[styles.simpleButtonText, props.textStyle]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  SimpleButtonContainer: {
    marginTop: 10,
    height: 48,
    backgroundColor: '#D1D1D1',
    borderRadius: 4,
    //borderColor: 'gray',
    borderWidth: 1,
    //borderBottomWidth: 1,
    //alignItems: 'center',
    justifyContent: 'center',
  },

  simpleButtonText: {
    color: 'black',
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 22,
    //textAlign: 'center',
  },
});

export default SimpleButton;
