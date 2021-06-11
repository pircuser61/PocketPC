import {observer} from 'mobx-react-lite';
import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const BigSquareInfo = observer(({data = '', title = '', loading = false}) => {
  return (
    <View
      style={{
        //height: 70,
        //width: 70,
        backgroundColor: 'white',
        alignItems: data && title !== 'Состояние' ? 'flex-start' : 'center',
        justifyContent: 'center',
        borderRadius: 8,
        margin: 16,
        padding: 16,
        marginBottom: 0,
      }}>
      <Text style={{fontSize: 10, fontWeight: 'bold'}}>{title}:</Text>

      <Text style={{}}>{data ? data : '---'}</Text>

      <View
        style={{
          height: 20,
          width: 20,
          position: 'absolute',
          right: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {title === 'Состояние' ? (
          loading ? (
            <ActivityIndicator size={'small'} color={'black'} style={{}} />
          ) : (
            <MaterialCommunityIcons size={20} name={'refresh'} />
          )
        ) : null}
      </View>
    </View>
  );
});

export default BigSquareInfo;

const styles = StyleSheet.create({});
