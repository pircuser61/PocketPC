import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {MAIN_COLOR} from '../../constants/funcrions';
import PerepalechivanieStore from '../../mobx/PerepalechivanieStore';

const ModalForCheckQty = observer(
  ({modalVisible = false, setModalVisible = () => {}}) => {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        collapsable={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('closed');
          setModalVisible(!modalVisible);
          PerepalechivanieStore.checkQtyMergeList = [];
        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0, 0.8)',
            padding: 20,
            overflow: 'hidden',
          }}>
          <View style={styles.centeredView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 8,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  width: 100,
                  // backgroundColor: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Код товара
              </Text>
              <Text
                style={{
                  width: 40,
                  //backgroundColor: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Куда
              </Text>
              <Text
                style={{
                  width: 60,
                  //backgroundColor: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Откуда
              </Text>
              <Text
                style={{
                  width: 50,
                  // backgroundColor: 'red',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Расх.
              </Text>
            </View>
            <Divider />
            <ScrollView style={{paddingHorizontal: 8}}>
              {PerepalechivanieStore.checkQtyMergeList?.length ? (
                PerepalechivanieStore.checkQtyMergeList.map(
                  (
                    r = {
                      $: {
                        CodGood: '',
                        NumPalFrom: '',
                        QtyDbs: '',
                        QtyZnp: '',
                        ShopTo: '',
                      },
                    },
                    i,
                  ) => {
                    return (
                      <View key={i}>
                        <View
                          key={i}
                          style={{
                            height: 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              width: 100,
                              //backgroundColor: 'red',
                              textAlign: 'center',
                            }}>
                            {r.$.CodGood}
                          </Text>
                          <Text
                            style={{
                              width: 40,
                              //backgroundColor: 'red',
                              textAlign: 'center',
                            }}>
                            {r.$.ShopTo}
                          </Text>
                          <Text
                            style={{
                              width: 60,
                              //backgroundColor: 'red',
                              textAlign: 'center',
                            }}>
                            {r.$.NumPalFrom}
                          </Text>
                          <Text
                            style={{
                              width: 50,
                              //backgroundColor: 'red',
                              textAlign: 'center',
                            }}>
                            {r.$.QtyZnp - r.$.QtyDbs}
                          </Text>
                        </View>
                        <Divider />
                      </View>
                    );
                  },
                )
              ) : (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    padding: 16,
                  }}>
                  Список пуст
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: MAIN_COLOR,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }}>
              <Text style={{color: 'white'}}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

export default ModalForCheckQty;

const styles = StyleSheet.create({
  centeredView: {
    width: '98%',
    height: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
