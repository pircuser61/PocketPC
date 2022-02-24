import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  FlatList,
  BackHandler,
} from 'react-native';
import {
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants/funcrions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export default ModalOfList = ({
  visible = false,
  list = [],
  setmodalVisible = () => {},
  onPressElement = () => {},
}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setmodalVisible(!visible);
      }}>
      <View style={styles.centeredView}>
        <View
          style={{
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 8,
            width: SCREEN_WIDTH * 0.9,
            maxHeight: SCREEN_HEIGHT * 0.7,
          }}>
          <View
            style={{
              width: '100%',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
              Паллеты
            </Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => setmodalVisible(false)}>
              <MaterialCommunityIcons name={'close'} size={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 0.5,
              width: '100%',
              marginVertical: 16,
              backgroundColor: 'grey',
            }}
          />

          <View style={{}}>
            {renderItem({
              item: {
                NumPal: 'Паллет',
                Order: 'Заказ',
                SuplierPal: 'Паллет пост.',
              },
              color: 'white',
            })}
          </View>
          <FlatList
            style={{}}
            data={[...list]}
            renderItem={item =>
              renderItem({
                item: item?.item,
                onPress: item => onPressElement(item),
              })
            }
            keyExtractor={item => item.NumPal}
          />
          <View style={{height: 16}} />
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              setmodalVisible(false);
            }}>
            <View
              style={{
                backgroundColor: MAIN_COLOR,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', padding: 16, fontWeight: 'bold'}}>
                ОК
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});

const renderItem = ({item, color, onPress = () => {}}) => {
  const {NumPal = '', Order = '', SuplierPal = ''} = item;
  const currcolor = color ?? 'black';
  return (
    <TouchableOpacity
      disabled={NumPal == 'Паллет'}
      onPress={() => onPress(NumPal)}
      style={{
        backgroundColor: NumPal == 'Паллет' ? MAIN_COLOR : 'grey',
        borderRadius: 8,
        marginVertical: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          //borderBottomWidth: 1,

          marginHorizontal: 8,
          marginVertical: 8,
        }}>
        <Text style={{width: 90, paddingVertical: 8, color: currcolor}}>
          {NumPal}
        </Text>
        <Text style={{width: 90, textAlign: 'center', color: currcolor}}>
          {Order}
        </Text>
        <Text style={{width: 90, textAlign: 'right', color: currcolor}}>
          {SuplierPal}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
