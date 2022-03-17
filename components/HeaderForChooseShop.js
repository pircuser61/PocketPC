import React from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR} from '../constants/funcrions';

const HeaderForChooseShop = ({
  title,
  isSecond,
  navigation,
  exitToAuthThunk,
  podrazd = {CodOb: '', GroupID: '', Id: '', Name: ''},
}) => {
  return (
    <View
      style={{
        backgroundColor: MAIN_COLOR,
        justifyContent: 'center',
        height: 60,
      }}>
      {typeof podrazd !== 'undefined' && podrazd.Id.length > 0 ? (
        <TouchableRipple
          style={{position: 'absolute', left: 0, opacity: 0.94, padding: 16}}
          onPress={() => {
            navigation.goBack();
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialCommunityIcons name="home-outline" size={26} color="white" />
        </TouchableRipple>
      ) : null}

      {isSecond ? (
        <TouchableRipple
          style={{position: 'absolute', left: 0, opacity: 0.94, padding: 16}}
          onPress={() => {
            navigation.goBack();
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
        </TouchableRipple>
      ) : null}

      {typeof podrazd !== 'undefined' && !podrazd?.Id && !isSecond ? (
        <TouchableRipple
          style={{position: 'absolute', right: 0, opacity: 0.94, padding: 16}}
          onPress={exitToAuthThunk}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialCommunityIcons name="exit-to-app" size={26} color="white" />
        </TouchableRipple>
      ) : null}

      <Text
        style={{
          marginHorizontal: 16,
          fontSize: 14,
          fontWeight: 'bold',
          alignSelf: 'center',
          letterSpacing: 0.15,
          color: 'white',
          opacity: 0.94,
        }}>
        {title}
      </Text>
    </View>
  );
};

export default HeaderForChooseShop;

/**
 *   <MaterialCommunityIcons
          onPress={() => {
            navigation.goBack();
          }}
          style={{position: 'absolute', left: 16, opacity: 0.94}}
          name="home-outline"
          size={26}
          color="white"
        />
 */
