import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {MAIN_COLOR, SCREEN_WIDTH} from '../../constants/funcrions';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  update?: () => void;
  error?: string;
}

const ErrorAndUpdateComponent = ({update = () => {}, error = ''}: Props) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{height: 8}} />
      <View
        style={{
          width: '100%',

          alignItems: 'center',
        }}>
        <Text style={styles.error}>{error}</Text>
        <Text></Text>
      </View>
      <TouchableOpacity onPress={update} style={styles.button}>
        <Text style={styles.buttonFont}>ОБНОВИТЬ</Text>
        <MaterialIcon
          name={'reload'}
          style={{position: 'absolute', right: 16}}
          size={16}
          color={'white'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ErrorAndUpdateComponent;
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 64,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
  },
  buttonFont: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  error: {
    alignSelf: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.9,
  },
});
