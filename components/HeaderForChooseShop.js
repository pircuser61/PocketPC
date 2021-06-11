import React from 'react';
import {View, Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderForChooseShop = ({title, isSecond, navigation,exitToAuthThunk,podrazd}) => {
  return (
    <View
      style={{
        backgroundColor: '#313C47',
        justifyContent: 'center',
        height: 60,
      }}>
         {typeof podrazd!=='undefined' && podrazd.Id.length>0 ? (
        <MaterialCommunityIcons
          onPress={() => {
            navigation.goBack();
          }}
          style={{position: 'absolute', left: 16, opacity: 0.94}}
          name="home-outline"
          size={26}
          color="white"
        />
      ) : null}
      {isSecond ? (
        <MaterialCommunityIcons
          onPress={() => {
            navigation.goBack();
          }}
          style={{position: 'absolute', left: 16, opacity: 0.94}}
          name="arrow-left"
          size={26}
          color="white"
        />
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
      <TouchableOpacity>
      <MaterialCommunityIcons
        style={{position: 'absolute', right: 16, opacity: 0.94}}
        name="exit-to-app"
        size={26}
        color="white"
        onPress={exitToAuthThunk}
      />
      </TouchableOpacity>
      
    </View>
  );
};

export default HeaderForChooseShop;
