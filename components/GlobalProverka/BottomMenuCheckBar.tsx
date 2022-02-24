import {observer} from 'mobx-react-lite';
import {Button, Menu, Pressable} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-paper';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {BRIGHT_GREY, MAIN_COLOR} from '../../constants/funcrions';
import {DocumentCheckScreenProps} from '../../screens/ProverkaPallets/DocumentCheckScreen';
import {BottomMenuCheckBarProps} from '../../types/ProverkaTypes';
import {
  GoodsRow,
  NakladnayaSpeckInterface,
  ProverkaNakladnyhNavProps,
  ProvperSpecsRow,
} from '../../types/types';
import ShowBarcodsOfGoodModal from './ShowBarcodsOfGoodModal';

const BottomMenuCheckBar = (
  props: BottomMenuCheckBarProps & DocumentCheckScreenProps,
) => {
  const {getNext, getPrev, goodInfo, relativePosition, getCurr} = props;
  return (
    <View
      style={{
        backgroundColor: MAIN_COLOR,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          props.navigateToCreate();
        }}
        //disabled={goodInfo ? false : true}
        style={[
          styles.buttonCircle,
          {
            opacity: 1,
          },
        ]}>
        <Feather name="plus" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={getCurr}
        disabled={goodInfo ? false : true}
        style={[
          styles.buttonCircle,
          {
            opacity: goodInfo ? 1 : 0,
          },
        ]}>
        <Feather name="refresh-ccw" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonCircle,
          {
            opacity: 1,

            width: 80,
          },
        ]}
        onPress={props.swipeFilter}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Фильтр</Text>
          <View style={{width: 4}}></View>
          <Feather
            name="check"
            size={20}
            color="white"
            style={{opacity: props.filter === 'false' ? 1 : 0}}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={
          goodInfo?.IdNum !== relativePosition.first?.idNum &&
          relativePosition.first
            ? false
            : true
        }
        style={[
          styles.buttonCircle,
          {
            opacity:
              goodInfo?.IdNum !== relativePosition.first?.idNum &&
              relativePosition.first &&
              goodInfo !== null
                ? 1
                : 0,
          },
        ]}
        onPress={getPrev}>
        <Feather name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={
          goodInfo?.IdNum !== relativePosition.last?.idNum ? false : true
        }
        style={[
          styles.buttonCircle,
          {
            opacity: goodInfo?.IdNum !== relativePosition.last?.idNum ? 1 : 0,
          },
        ]}
        onPress={getNext}>
        <Feather name="chevron-right" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenuCheckBar;

const styles = StyleSheet.create({
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 55,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});

/**
 *   <Menu.Item
          style={{height: 50}}
          justifyContent={'center'}
          onPress={props.createDeleteAlert}>
          <Text style={{fontWeight: 'bold'}}>Удалить товар</Text>
        </Menu.Item>
 */

/**
         *  <Menu
        placement={'top'}
        w="190"
        trigger={triggerProps => {
          return (
            <TouchableOpacity
              {...triggerProps}
              disabled={goodInfo ? 0 : 1}
              style={[
                styles.buttonCircle,
                {
                  opacity: goodInfo ? 1 : 0,
                },
              ]}>
              <Feather name="more-vertical" size={20} color="white" />
            </TouchableOpacity>
          );
        }}>
        <Divider />
        <Menu.Item
          style={{height: 50}}
          justifyContent={'center'}
          onPress={() => setshowBarcodeModal(true)}>
          <Text style={{fontWeight: 'bold'}}>Показать баркода</Text>
        </Menu.Item>
        <Divider />
        <Menu.Item
          style={{height: 50}}
          justifyContent={'center'}
          onPress={() => setshowSecondModal(true)}>
          <Text style={{fontWeight: 'bold'}}>Показать паллеты</Text>
        </Menu.Item>
        <Divider />
        <Menu.Item
          style={{height: 50}}
          justifyContent={'center'}
          onPress={() => setshowShopsModal(true)}>
          <Text style={{fontWeight: 'bold'}}>Показать остатки</Text>
        </Menu.Item>
      </Menu>
         */
