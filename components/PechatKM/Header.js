import * as React from 'react';
import {Text, View} from 'react-native';
import {Appbar, IconButton, TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR} from '../../constants/funcrions';

const Header = ({
  reload,
  printer,
  setUser,
  user,
  navigation,
  emptyheader = false,
}) => {
  return (
    <View
      style={{
        backgroundColor: MAIN_COLOR,
        justifyContent: 'center',
        height: 60,
      }}>
      <TouchableRipple
        style={{position: 'absolute', left: 0, opacity: 0.94, padding: 16}}
        onPress={() => {
          navigation.goBack();
        }}
        rippleColor="rgba(0, 0, 0, .32)">
        <MaterialCommunityIcons name="home-outline" size={26} color="white" />
      </TouchableRipple>

      {emptyheader ? (
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
          {printer ? printer : ''}
        </Text>
      ) : (
        <>
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
            Устройство: {user ? user['deviceName'] : null}
          </Text>
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
            {printer ? 'Принтер: ' + printer : 'Происходит поиск принтера'}
          </Text>
        </>
      )}
      <TouchableRipple
        style={{position: 'absolute', right: 0, opacity: 0.94, padding: 16}}
        onPress={() => reload(true)}
        rippleColor="rgba(0, 0, 0, .32)">
        <MaterialCommunityIcons name="reload" size={26} color="white" />
      </TouchableRipple>
    </View>
  );
};

export default Header;

/*
 <Appbar.Header style={{backgroundColor:'#151717'}}>
      <Appbar.Content title={<Text style={{fontSize:14}}>{user?user['user']["TokenData"][0]["$"]["UserName"]:null} {0user?user['user']["TokenData"][0]["$"]["UserUID"]:null}</Text>} subtitle={<Text style={{fontSize:10}}>{printer?"Принтер: "+printer:'Происходит поиск принтера'} | Устройство: {user?user["deviceName"]:null}</Text>} />
      <Appbar.Action icon="reload" onPress={()=>reload(true)} />
      <Appbar.Action icon="exit-run" onPress={()=>setUser().catch(e=>console.log(e))} />

    </Appbar.Header>*/
