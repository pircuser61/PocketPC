import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Button} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR} from '../constants/funcrions';

const HeaderHomeScreen = props => {
  const {info, user, exitToAuthThunk, navigation, podrazd} = props;
  return (
    <View
      style={{backgroundColor: MAIN_COLOR, height: 140, alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('GetBarcodeInfoScreen');
        }}
        style={{position: 'absolute', right: 16, top: 16}}>
        <MaterialCommunityIcons
          style={{alignSelf: 'center'}}
          name="barcode-scan"
          size={24}
          color={'white'}
        />
      </TouchableOpacity>

      <View style={{marginVertical: 16, marginHorizontal: 48}}>
        <Text style={{fontSize: 18, color: 'white'}} numberOfLines={1}>
          {podrazd.Name}
        </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChangeShop');
          }}
          style={styles.button}>
          <View style={{marginLeft: 16}}>
            <MaterialCommunityIcons
              style={{
                position: 'absolute',
                right: 16,
                top: 1,
                alignSelf: 'center',
              }}
              name="chevron-right"
              size={16}
              color="white"
            />
            <Text style={{fontSize: 14, color: '#FFFFFF', opacity: 0.87}}>
              {podrazd.Id}
            </Text>
            <Text style={{fontSize: 10, color: '#FFFFFF', opacity: 0.6}}>
              Код подразделения
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={exitToAuthThunk} style={styles.button}>
          <View style={{marginLeft: 16}}>
            <MaterialCommunityIcons
              style={{
                position: 'absolute',
                right: 16,
                top: 1,
                alignSelf: 'center',
              }}
              name="exit-to-app"
              size={16}
              color="white"
            />
            <Text style={{fontSize: 14, color: '#FFFFFF', opacity: 0.87}}>
              {user.$.UserUID}
            </Text>
            <Text style={{fontSize: 10, color: '#FFFFFF', opacity: 0.6}}>
              Табельный номер
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 60,
    backgroundColor: '#5b6672',
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default HeaderHomeScreen;
