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

export default CrossDockCheckModal = ({
  visible = false,
  setmodalVisible = () => {},
  onPressPallete = () => {},
  updateAction = async () => {},
}) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [list, setList] = useState([]);

  const getList = async () => {
    try {
      setStatus('');
      setLoading(true);
      let result = await updateAction();
      if (Array.isArray(result)) {
        setList(result);
      } else setList([result]);
    } catch (error) {
      if (error?.includes('пуст')) {
        setStatus('Сначала, сканируйте первый паллет');
      } else {
        setStatus(`${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      getList();
    } else setLoading(true);
  }, [visible]);

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
            width: SCREEN_WIDTH * 0.8,
            maxHeight: SCREEN_HEIGHT * 0.5,
          }}>
          <View
            style={{
              width: '100%',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
              Неотгруженные паллеты
            </Text>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => setmodalVisible(false)}>
              <MaterialCommunityIcons name={'close'} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{position: 'absolute', left: 0}}
              onPress={getList}>
              <MaterialCommunityIcons name={'update'} size={24} />
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

          {loading ? (
            <View
              style={{
                maxHeight: SCREEN_HEIGHT * 0.5,
                minHeight: SCREEN_HEIGHT * 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={32} color={'black'} />
            </View>
          ) : !status.length ? (
            <FlatList
              style={{
                maxHeight: SCREEN_HEIGHT * 0.5,
                minHeight: SCREEN_HEIGHT * 0.1,
              }}
              data={list}
              renderItem={item => (
                <TouchableOpacity
                  onPress={() => onPressPallete(item.item.NumPal)}
                  style={{
                    height: 50,
                    backgroundColor: MAIN_COLOR,
                    marginVertical: 8,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    flexDirection: 'row',
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {item.item.NumPal}
                  </Text>
                  <MaterialCommunityIcons
                    name={'arrow-right'}
                    size={16}
                    color={'white'}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index + ''}
            />
          ) : (
            <View
              style={{
                maxHeight: SCREEN_HEIGHT * 0.5,
                minHeight: SCREEN_HEIGHT * 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>{status}</Text>
            </View>
          )}
          <View
            style={{
              height: 0.5,
              width: '100%',
              marginVertical: 16,
              backgroundColor: 'grey',
            }}
          />
          <TouchableOpacity
            onPress={() => setmodalVisible(false)}
            style={{
              height: 50,
              backgroundColor: MAIN_COLOR,
              marginVertical: 8,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
              borderRadius: 8,
              flexDirection: 'row',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Назад</Text>
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
