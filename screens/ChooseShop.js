import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ShopStore from '../mobx/ShopStore';

const ChooseShop = ({navigation}) => {
  const setShop = (shopname = '') => {
    ShopStore.chooseShop(shopname);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            //position: 'absolute',
            alignSelf: 'center',
            //top: 40,
          }}>
          <Text style={{fontSize: 14, fontWeight: '500'}}>
            Выберите магазин, в котором вы работаете
          </Text>
        </View>
        <View style={{height: 16}} />
        <TouchableOpacity onPress={() => setShop('maxidom')}>
          <Image
            source={require('../assets/maxidompic.png')}
            style={styles.imagestyle}
          />
        </TouchableOpacity>
        <View style={{height: 16}} />
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setShop('castorama')}>
          <Image
            source={require('../assets/castoramapic.jpeg')}
            style={styles.imagestyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseShop;

const styles = StyleSheet.create({
  imagestyle: {
    width: 200,
    height: 80,
    borderRadius: 8,
  },
});
