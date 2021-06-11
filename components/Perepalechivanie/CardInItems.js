import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const CardInItems = ({left = '', right = ''}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
      }}>
      <Text style={styles.textstyle}>{left}:</Text>
      <Text style={styles.textstyle}>{right}</Text>
    </View>
  );
};

export default CardInItems;

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
